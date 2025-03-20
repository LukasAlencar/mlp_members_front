import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import InputMask from 'react-input-mask';
import ModalDefault from '../ModalDefault';
import axios from 'axios';
import { base_url } from '../../services/config';
import useModal from '../Modal';

const RegisterMember = () => {
  const [member, setMember] = useState({
    name: '',
    email: '',
    cpf: '',
    rg: '',
    birthDay: '',
    baptismDate: '',
    memberSince: '',
    role: '',
    image: null,
    phone: ''
  });

  const { modalAlert, modal } = useModal();

  const [modalShow, setModalShow] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === 'file' ? files[0] : value;

    setMember((prevMember) => ({
      ...prevMember,
      [name]: newValue,
    }));

    let error = '';
    switch (name) {
      case 'email':
        error = validateEmail(newValue);
        break;
      case 'name':
        error = validateName(newValue);
        break;
      case 'cpf':
        error = validateCpf(newValue);
        break;
      case 'birthDay':
        error = validateBirthDay(newValue);
        break;
      case 'role':
        error = validateRole(newValue);
        break;
      case 'image':
        error = await validateImage(newValue);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? '' : 'E-mail inválido';
  };

  const validateName = (name) => {
    return name.trim().length >= 3 ? '' : 'O nome deve ter pelo menos 3 caracteres';
  };

  const validateCpf = (cpf) => {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf) ? '' : 'CPF inválido (formato correto: 000.000.000-00)';
  };

  const validateBirthDay = (birthDay) => {
    if (!birthDay) return 'Data de nascimento é obrigatória';
    const today = new Date();
    const birthDate = new Date(birthDay);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 12 ? '' : 'O membro deve ter pelo menos 12 anos';
  };

  const validateRole = (role) => {
    const validRoles = ['member', 'pastor', 'elder', 'deacon', 'auxiliary'];
    return validRoles.includes(role) ? '' : 'Cargo inválido';
  };

  // const validateImage = (image) => {
  //   if (!image) return 'A imagem é obrigatória';
  //   const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
  //   return allowedExtensions.includes(image.type) ? '' : 'Apenas imagens JPEG ou PNG são permitidas';
  // };

  const validateImage = (image) => {
    if (!image) return 'A imagem é obrigatória';

    const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedExtensions.includes(image.type)) {
      return 'Apenas imagens JPEG ou PNG são permitidas';
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;

        if (Math.abs(aspectRatio - (3 / 4)) > 0.01) {
          resolve('A imagem deve ter proporção 3x4');
        } else {
          resolve('');
        }
      };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(member.name),
      email: validateEmail(member.email),
      cpf: validateCpf(member.cpf),
      birthDay: validateBirthDay(member.birthDay),
      role: validateRole(member.role),
      image: await validateImage(member.image),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value)
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      return;
    }

    const memberWithoutImage = {
      name: member.name,
      email: member.email,
      cpf: member.cpf,
      birthDate: member.birthDay + 'T00:00:00.000Z',
      baptismDate: member.baptismDate + 'T00:00:00.000Z',
      memberSince: member.memberSince + 'T00:00:00.000Z',
      rg: member.rg,
      role: member.role.toUpperCase(),
      phone: member.phone,
    };


    await axios.post(base_url + 'member',
      memberWithoutImage,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    )
      .then((res) => {
        setModalShow(true);
      })
      .catch((err) => {
        console.log(err);

        modalAlert(
          "Erro",
          typeof err.response.data.error === "string"
            ? err.response.data.error
            : "Erro ao cadastrar membro",
          () => {}
        );
      });
  };


  return (
    <>
      <ModalDefault btnConfirm={() => setModalShow(false)} btnConfirmText={'Ok'} modalShow={modalShow} setModalShow={setModalShow} headerTitle={'Sucesso!'} bodyMessage={'Membro cadastrado com sucesso!'} />
      {modal}
      <div className="w-screen h-screen text-zinc-100 flex">
        <Sidebar />
        <div className="bg-zinc-950 min-h-screen flex items-center w-full justify-center p-5">
          <div className="bg-zinc-900 p-8 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-2xl text-white mb-4">Cadastrar membro</h2>
            <form>

              <div className="flex justify-center items-center mb-4 gap-2">
                <div className="w-8/12">
                  <label className="text-white block mb-2" htmlFor="name">Nome completo</label>
                  <input
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    type="text"
                    id="name"
                    name="name"
                    value={member.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-2">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-white block mb-2" htmlFor="cpf">CPF</label>
                  <InputMask
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    mask="999.999.999-99"
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={member.cpf}
                    onChange={handleChange}
                  />
                  {errors.cpf && <p className="text-red-400 text-xs mt-2">{errors.cpf}</p>}
                </div>
              </div>

              <div className="flex justify-center items-center mb-4 gap-2">
                <div className="w-8/12">
                  <label className="text-white block mb-2" htmlFor="email">Email</label>
                  <input
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    type="email"
                    id="email"
                    name="email"
                    value={member.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-white block mb-2" htmlFor="rg">RG</label>
                  <InputMask
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    mask="99.999.999-9"
                    type="text"
                    id="rg"
                    name="rg"
                    value={member.rg}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-center items-center mb-4 gap-2">
                <div className="w-4/12">
                  <label className="text-white block mb-2" htmlFor="birthDay">Data de nascimento</label>
                  <input
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    type="date"
                    id="birthDay"
                    name="birthDay"
                    value={member.birthDay}
                    onChange={handleChange}
                  />
                  {errors.birthDay && <p className="text-red-400 text-xs mt-2">{errors.birthDay}</p>}
                </div>
                <div className="w-4/12">
                  <label className="text-white block mb-2" htmlFor="baptismDate">Data de batismo</label>
                  <input
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    type="date"
                    id="baptismDate"
                    name="baptismDate"
                    value={member.baptismDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-4/12">
                  <label className="text-white block mb-2" htmlFor="memberSince">Membro desde</label>
                  <input
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    type="date"
                    id="memberSince"
                    name="memberSince"
                    value={member.memberSince}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-center items-center mb-4 gap-2">
                <div className="w-4/12">
                  <label className="text-white block mb-2" htmlFor="role">Cargo</label>
                  <select
                    className="bg-zinc-700 text-white rounded w-full py-3 px-3"
                    id="role"
                    name="role"
                    value={member.role}
                    onChange={handleChange}
                  >

                    <option value="">Selecione...</option>
                    <option value="member">Membro</option>
                    <option value="pastor">Pastor</option>
                    <option value="elder">Presbítero</option>
                    <option value="deacon">Diácono</option>
                    <option value="auxiliary">Auxiliar</option>
                  </select>
                  {errors.role && <p className="text-red-400 text-xs mt-2">{errors.role}</p>}
                </div>
                <div className="w-4/12">
                  <label className="text-white block mb-2" htmlFor="image">Imagem</label>
                  <input
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    type="file"
                    id="image"
                    name="image"
                    accept='image/png, image/jpeg, image/jpg'
                    onChange={handleChange}
                  />
                </div>
                {errors.image && <p className="text-red-400 text-xs mt-2">{errors.image}</p>}
                <div className='w-4/12'>
                  <label className="text-white block mb-2" htmlFor="rg">Phone</label>
                  <InputMask
                    className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                    mask="(99) 99999-9999"
                    type="text"
                    id="phone"
                    name="phone"
                    value={member.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div onClick={handleSubmit} className="bg-zinc-500 cursor-pointer hover:bg-zinc-600 text-white py-2 px-4 w-fit rounded">
                Cadastrar
              </div>
            </form>
          </div>
        </div>
      </div>
    </>

  );
};

export default RegisterMember;
