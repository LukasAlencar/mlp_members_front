import { GoTrash } from "react-icons/go";
import { HiOutlinePencilAlt } from "react-icons/hi";
import useModal from './Modal';
import { base_url } from "../services/config";
import axios from "axios";

export const MemberRow = ({ member, index, onRemove }) => {

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }

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
      setTimeout(()=>{
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
      <td className="px-4 text-center py-2 border border-zinc-700">
        <div className="w-full h-full flex justify-center items-center gap-2">
          <GoTrash onClick={handleRemove} className="cursor-pointer hover:text-red-600" size={20} />
          <HiOutlinePencilAlt className="cursor-pointer hover:hover:text-blue-600" size={20} />
        </div>
      </td>
    </tr>
  )
}


export default MemberRow
