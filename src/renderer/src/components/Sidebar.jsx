import logo from "../assets/mlpmembroslogo.png"
import { IoLogOutOutline, IoPersonAddOutline, IoList } from "react-icons/io5";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router";
import ModalDefault from "./ModalDefault";
import { RiHome9Line } from "react-icons/ri";
import { useState } from "react";

export const Sidebar = () => {
  const [modalShow, setModalShow] = useState()

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  }

  const navigate = useNavigate();
  return (
    <>
      <ModalDefault modalShow={modalShow} setModalShow={setModalShow} headerTitle="Sair" bodyMessage={"Você tem certeza que deseja sair?"} btnDanger={() => handleLogout()} btnDangerText={'Sair'} />
      <div className="w-3/12 h-full bg-zinc-900 flex flex-col items-center justify-start text-zinc-100">
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <img src={logo} alt="logo" className="w-8/12" />
          <span className='w-full border border-zinc-700 mb-5'></span>
        </div>
        <div className="flex flex-col items-center justify-start w-full">
          <SidebarItem value={'Início'} icon={<RiHome9Line size={22} />} onClick={() => navigate('/home')} />
          <SidebarItem value={'Adicionar Membro'} icon={<IoPersonAddOutline size={22} />} onClick={() => navigate('/registerMember')} />
          <SidebarItem value={'Lista de Membros'} icon={<IoList size={22} />} onClick={() => navigate('/listMembers')} />
        </div>
        <div className="flex-1 flex items-end justify-start w-full">
          <SidebarItem value={'Sair'} icon={<IoLogOutOutline size={24} />} hoverBg={'danger'} onClick={() => setModalShow(true)} />
        </div>
      </div>
    </>
  )
}


export default Sidebar
