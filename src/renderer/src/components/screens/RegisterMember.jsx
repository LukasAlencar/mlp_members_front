import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import InputMask from 'react-input-mask';
import ModalDefault from '../ModalDefault';
import axios from 'axios';
import { base_url } from '../../services/config';
import useModal from '../Modal';
import { validateBirthDate, validateCpf, validateEmail, validateImage, validateName, validatePhone, validateRG, validateRole } from '../../hooks/validateFields';
import cuid from 'cuid';

const RegisterMember = () => {
  const [member, setMember] = useState({
    name: '',
    email: '',
    cpf: '',
    rg: '',
    birthDate: '',
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
        error = newValue == "" ? "" : validateEmail(newValue);
        break;
      case 'name':
        error = validateName(newValue);
        break;
      case 'cpf':
        error = validateCpf(newValue);
        break;
      case 'birthDate':
        error = validateBirthDate(newValue);
        break;
      case 'role':
        error = validateRole(newValue);
        break;
      case 'image':
        error = await validateImage(newValue);
        break;
      case 'phone':
        error = validatePhone(newValue);
        break;
      case 'rg':
        error = validateRG(newValue);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(member.name),
      email: member.email ? validateEmail(member.email) : '',
      cpf: validateCpf(member.cpf),
      birthDate: validateBirthDate(member.birthDate),
      role: validateRole(member.role),
      phone: validatePhone(member.phone),
      rg: validateRG(member.rg),
      image: member.image ? await validateImage(member.image) : '', // Validação opcional
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value)
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      return;
    }

    // Criando o FormData para enviar a imagem e os dados juntos
    const formData = new FormData();

    formData.append("id", cuid());
    formData.append("name", member.name);

    member.email && formData.append("email", member.email);

    formData.append("cpf", member.cpf);
    formData.append("birthDate", member.birthDate + "T00:00:00.000Z");

    member.baptismDate && formData.append("baptismDate", member.baptismDate + "T00:00:00.000Z");
    member.memberSince && formData.append("memberSince", member.memberSince + "T00:00:00.000Z");

    formData.append("rg", member.rg);
    formData.append("role", member.role.toUpperCase());
    formData.append("phone", member.phone);

    // Adiciona a imagem, se existir
    if (member.image) {
      formData.append("image", member.image);
    }

    try {
      const res = await axios.post(base_url + "member", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      setModalShow(true);
    } catch (err) {
      console.log(err);

      modalAlert(
        "Erro",
        typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : "Erro ao cadastrar membro",
        () => { }
      );
    }
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
                  <label className="text-white block mb-2" htmlFor="name">Nome completo *</label>
                  <input
                    className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.name ? 'red' : 'zinc'}-700`}
                    type="text"
                    id="name"
                    name="name"
                    value={member.name}
                    onChange={handleChange}
                  />
                  <div className='h-4 mt-2'>
                    {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-white block mb-2" htmlFor="cpf">CPF *</label>
                  <InputMask
                    className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.cpf ? 'red' : 'zinc'}-700`}
                    mask="999.999.999-99"
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={member.cpf}
                    onChange={handleChange}
                  />
                  <div className='h-4 mt-2'>
                    {errors.cpf && <p className="text-red-400 text-xs mt-2">{errors.cpf}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center mb-4 gap-2">
                <div className="w-8/12">
                  <label className="text-white block mb-2" htmlFor="email">Email</label>
                  <input
                    className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.email ? 'red' : 'zinc'}-700`}
                    type="email"
                    id="email"
                    name="email"
                    value={member.email}
                    onChange={handleChange}
                  />
                  <div className='h-4 mt-2'>
                    {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-white block mb-2" htmlFor="rg">RG *</label>
                  <InputMask
                    className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.rg ? 'red' : 'zinc'}-700`}
                    mask="99.999.999-9"
                    type="text"
                    id="rg"
                    name="rg"
                    value={member.rg}
                    onChange={handleChange}
                  />
                  <div className='h-4 mt-2'>
                    {errors.rg && <p className="text-red-400 text-xs mt-2">{errors.rg}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center mb-4 gap-2">
                <div className="w-4/12">
                  <label className="text-white block mb-2" htmlFor="birthDate">Data de nascimento *</label>
                  <input
                    className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.birthDate ? 'red' : 'zinc'}-700`}
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={member.birthDate}
                    onChange={handleChange}
                  />
                  <div className='h-4 mt-2'>
                    {errors.birthDate && <p className="text-red-400 text-xs mt-2">{errors.birthDate}</p>}
                  </div>
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
                  <div className='h-4 mt-2'></div>
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
                  <div className='h-4 mt-2'></div>
                </div>
              </div>

              <div className="flex justify-center items-center mb-4 gap-2">
                <div className="w-4/12">
                  <label className="text-white block mb-2" htmlFor="role">Cargo *</label>
                  <select
                    className={`bg-zinc-700 text-white rounded w-full py-3 px-3 border border-${errors.role ? 'red' : 'zinc'}-700`}
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
                  <div className='h-4 mt-2'>
                    {errors.role && <p className="text-red-400 text-xs mt-2">{errors.role}</p>}
                  </div>
                </div>
                <div className="w-4/12">
                  <label className="text-white block mb-2" htmlFor="image">Imagem *</label>
                  <input
                    className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.image ? 'red' : 'zinc'}-700`}
                    type="file"
                    id="image"
                    name="image"
                    accept='image/png, image/jpeg, image/jpg'
                    onChange={handleChange}
                  />
                  <div className='h-4 mt-2'>
                    {errors.image && <p className="text-red-400 text-xs mt-2">{errors.image}</p>}
                  </div>
                </div>
                <div className='w-4/12'>
                  <label className="text-white block mb-2" htmlFor="rg">Phone *</label>
                  <InputMask
                    className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.phone ? 'red' : 'zinc'}-700`}
                    mask="(99) 99999-9999"
                    type="text"
                    id="phone"
                    name="phone"
                    value={member.phone}
                    onChange={handleChange}
                  />
                  <div className='h-4 mt-2'>
                    {errors.phone && <p className="text-red-400 text-xs mt-2">{errors.phone}</p>}
                  </div>

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
