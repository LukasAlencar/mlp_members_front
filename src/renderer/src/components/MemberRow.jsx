import { GoTrash } from "react-icons/go";
import { HiOutlinePencilAlt } from "react-icons/hi";
import useModal from './Modal';
import { base_url } from "../services/config";
import axios from "axios";
import { useRef, useState } from "react";
import InputMask from 'react-input-mask';
import { MdOutlineCancel } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { validateBirthDate, validateCpf, validateEmail, validateImage, validateName, validatePhone, validateRG, validateRole } from "../hooks/validateFields";
import { TbPhotoSquareRounded } from "react-icons/tb";
import { TbPhotoEdit } from "react-icons/tb";
import cuid from "cuid";



export const MemberRow = ({ member, index, onRemove }) => {

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);

  const [memberEdited, setMemberEdited] = useState({ ...member });

  const [errors, setErrors] = useState({});

  const inputRefs = useRef({});

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === 'file' ? files[0] : value;

    setMemberEdited((prev) => ({ ...prev, [name]: newValue }));

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

  const formatRole = (role) => {
    var role_lower = role.toLowerCase();

    switch (role_lower) {
      case "pastor":
        return "Pastor";
      case "deacon":
        return "Diácono";
      case "member":
        return "Membro";
      case "elder":
        return "Presbítero";
      case "auxiliary":
        return "Auxiliar";
      default:
        return "Membro";
    }

  }

  const { modalConfirm, modal, modalAlert } = useModal();

  const handleRemove = () => {
    modalConfirm("Remover membro", "Deseja realmente remover este membro?", () => {
      setTimeout(() => {
        modalAlert("Operação cancelada", "Nenhum dado foi alterado");
      }, 500);
    }, () => {
      setTimeout(() => {
        removeMember();
      }, 500)
    })
  }

  const removeMember = async () => {
    try {
      const { data } = await axios.delete(base_url + "member/" + member.id, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      console.log(data)
      setTimeout(() => {
        modalAlert("Membro removido", `Membro ${member.name} removido com sucesso`);
        onRemove(member.id);
      }, 1000)
    } catch (err) {
      modalAlert("Erro ao remover membro", err.response?.data?.message || "Erro ao remover membro");
    }
  }

  const handleUpdate = async () => {

    const newErrors = {
      name: validateName(memberEdited.name),
      email: memberEdited.email ? validateEmail(memberEdited.email) : '',
      cpf: validateCpf(memberEdited.cpf),
      birthDate: validateBirthDate(memberEdited.birthDate),
      role: validateRole(memberEdited.role.toLowerCase()),
      phone: validatePhone(memberEdited.phone),
      rg: validateRG(memberEdited.rg),
      image: await validateImage(memberEdited.image),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value)
    );

    const focusFirstError = () => {
      const firstErrorKey = Object.keys(filteredErrors)[0];
      if (firstErrorKey && inputRefs.current[firstErrorKey]) {
        inputRefs.current[firstErrorKey].focus();
      }
    };

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      console.log(filteredErrors)

      modalAlert("Erro ao editar membro", "Verifique os campos destacados", () => {
        focusFirstError();
      });

      return;
    }

    updateMember();

  }

  const updateMember = async () => {
    const formData = new FormData();

    formData.append("id", member.id);
    formData.append("name", member.name);

    memberEdited.email && formData.append("email", memberEdited.email);

    formData.append("cpf", memberEdited.cpf);
    formData.append("birthDate", memberEdited.birthDate);

    memberEdited.baptismDate && formData.append("baptismDate", memberEdited.baptismDate);
    memberEdited.memberSince && formData.append("memberSince", memberEdited.memberSince);

    formData.append("rg", memberEdited.rg);
    formData.append("role", memberEdited.role.toUpperCase());
    formData.append("phone", memberEdited.phone);

    // Adiciona a imagem, se existir
    if (memberEdited.image) {
      formData.append("image", memberEdited.image);
    }

    try {
      const { data } = await axios.put(base_url + "member/" + member.id, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      console.log(data);
      modalAlert("Membro atualizado", <p className="">Membro <span className="text-yellow-500">{member.name}</span> atualizado com sucesso</p>);
      setIsEditing(false);
    } catch (err) {
      modalAlert("Erro ao atualizar membro", err.response?.data?.message || "Erro ao atualizar membro");
    }

  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    setMemberEdited({ ...member });
  }

  const viewImage = () => {
    modalAlert(memberEdited.name, <img key={memberEdited.id} src={`${base_url}userImages/${memberEdited.id}.png`} alt={memberEdited.name} />);
  }

  const editPhoto = () => {
    if (inputRefs.current['image']) {
      inputRefs.current['image'].click();
    }
  };
  if (!isEditing) {
    return (
      <tr className={index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"}>
        {modal}
        <td className="px-4 text-center min-w-[150px] py-2 border border-zinc-700">{member.name}</td>
        <td className="px-4 text-center py-2 border border-zinc-700">{formatRole(member.role)}</td>
        <td className="px-4 text-center py-2 border border-zinc-700">{member.email}</td>
        <td className="px-4 text-center min-w-[150px] py-2 border border-zinc-700">{member.cpf}</td>
        <td className="px-4 text-center min-w-[150px] py-2 border border-zinc-700">{member.rg}</td>
        <td className="px-4 text-center min-w-[170px] py-2 border border-zinc-700">{member.phone}</td>
        <td className="px-4 text-center py-2 border border-zinc-700">{formatDate(member.baptismDate)}</td>
        <td className="px-4 text-center py-2 border border-zinc-700">{formatDate(member.birthDate)}</td>
        <td className="px-4 text-center py-2 border border-zinc-700">{formatDate(member.memberSince)}</td>
        <td className="px-4 text-center min-w-[50px] py-2 border border-zinc-700">
          <div className="w-full h-full flex justify-center items-center">
            <TbPhotoSquareRounded size={23} className="hover:text-blue-500 cursor-pointer" onClick={viewImage} />
          </div>
        </td>
        <td className="px-4 text-center py-2 border border-zinc-700">
          <div className="w-full h-full flex justify-center items-center gap-2">
            <GoTrash onClick={handleRemove} className="cursor-pointer hover:text-red-600" size={20} />
            <HiOutlinePencilAlt onClick={() => setIsEditing(true)} className="cursor-pointer hover:hover:text-blue-600" size={20} />
          </div>
        </td>
      </tr>
    )
  } else {
    return (
      <tr className={index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"}>
        {modal}
        <td className="px-4 text-center min-w-[300px] py-2 border border-zinc-700">
          <input
            type="text"
            name="name"
            value={memberEdited.name}
            onChange={handleChange}
            className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.name ? 'red' : 'zinc'}-700`}
            ref={(el) => { inputRefs.current['name'] = el }}
          />
        </td>
        <td className="px-4 text-center py-2 border min-w-[140px] border-zinc-700">
          <select
            name="role"
            value={memberEdited.role.toLowerCase()}
            onChange={handleChange}
            className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.role ? 'red' : 'zinc'}-700`}
            ref={(el) => { inputRefs.current['role'] = el }}
          >
            <option value="pastor">Pastor</option>
            <option value="deacon">Diácono</option>
            <option value="member">Membro</option>
            <option value="elder">Presbítero</option>
            <option value="auxiliary">Auxiliar</option>
          </select>
        </td>
        <td className="px-4 text-center min-w-[270px] py-2 border border-zinc-700">
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={memberEdited.email}
            className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.email ? 'red' : 'zinc'}-700`}
            ref={(el) => { inputRefs.current['email'] = el }}
          />
        </td>
        <td className="px-4 text-center min-w-[170px] py-2 border border-zinc-700">
          <InputMask
            className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.cpf ? 'red' : 'zinc'}-700`}
            value={memberEdited.cpf}
            type="text"
            id="cpf"
            onChange={handleChange}
            name="cpf"
            mask="999.999.999-99"
            ref={(el) => { inputRefs.current['cpf'] = el }}
          />
        </td>
        <td className="px-4 text-center min-w-[160px] py-2 border border-zinc-700">
          <InputMask
            className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.rg ? 'red' : 'zinc'}-700`}
            id="rg"
            name="rg"
            value={memberEdited.rg}
            onChange={handleChange}
            type="text"
            mask="99.999.999-9"
            ref={(el) => { inputRefs.current['rg'] = el }}
          />
        </td>
        <td className="px-4 text-center min-w-[180px] py-2 border border-zinc-700">
          <InputMask
            className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.phone ? 'red' : 'zinc'}-700`}
            id="phone"
            name="phone"
            value={memberEdited.phone}
            onChange={handleChange}
            type="text"
            mask="(99) 99999-9999"
            ref={(el) => { inputRefs.current['phone'] = el }}
          />
        </td>
        <td className="px-4 text-center py-2 border border-zinc-700">
          <input
            type="date"
            name="baptismDate"
            value={memberEdited.baptismDate ? new Date(memberEdited.baptismDate).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            className="bg-zinc-700 text-white rounded w-full py-2 px-3"
          />
        </td>
        <td className="px-4 text-center py-2 border border-zinc-700">
          <input
            type="date"
            name="birthDate"
            value={memberEdited.birthDate ? new Date(memberEdited.birthDate).toISOString().split('T')[0] : ''}
            className={`bg-zinc-700 text-white rounded w-full py-2 px-3 border border-${errors.birthDate ? 'red' : 'zinc'}-700`}
            onChange={handleChange}
            ref={(el) => { inputRefs.current['birthDate'] = el }}
          />
        </td>
        <td className="px-4 text-center py-2 border border-zinc-700">
          <input
            type="date"
            name="memberSince"
            value={memberEdited.memberSince ? new Date(memberEdited.memberSince).toISOString().split('T')[0] : ''}
            className="bg-zinc-700 text-white rounded w-full py-2 px-3"
            onChange={handleChange}
          />
        </td>
        <td className="px-4 text-center py-2 border border-zinc-700">
          <div className="flex justify-center items-center">
            {memberEdited.image ?
              (
                <TbPhotoEdit onClick={editPhoto} size={23} title={memberEdited.image ? memberEdited.image?.name : "Nenhuma imagem selecionada"} className="hover:text-blue-500 cursor-pointer" />
              )
              :
              (
                <TbPhotoEdit onClick={editPhoto} size={23} title={memberEdited.imagePath ? memberEdited.imagePath.replace("userImages/", "") : "Nenhuma imagem selecionada"} className="hover:text-blue-500 cursor-pointer" />
              )
            }
          </div>
          <input
            type="file"
            name="image"
            id="image"
            accept='image/png, image/jpeg, image/jpg'
            className="bg-zinc-700 text-white rounded w-full py-2 px-3 hidden"
            onChange={handleChange}
            ref={(el) => { inputRefs.current['image'] = el }}
          />
        </td>
        <td className="px-4 text-center py-2 border border-zinc-700">
          <div className="w-full h-full flex justify-center items-center gap-2">
            <FaRegCheckCircle title="Confirmar edição" onClick={handleUpdate} className="cursor-pointer hover:text-blue-600" size={20} />
            <MdOutlineCancel title="Cancelar edição" onClick={handleCancelEdit} className="cursor-pointer hover:hover:text-red-600" size={23} />
          </div>
        </td>
      </tr>
    )
  }
}


export default MemberRow
