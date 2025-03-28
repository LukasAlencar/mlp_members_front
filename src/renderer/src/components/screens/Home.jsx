import { useNavigate } from "react-router";
import Sidebar from "../Sidebar";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import useModal from "../Modal";
import { base_url } from "../../services/config";
import axios from "axios";
import HorizontalDivider from "../HorizontalDivider";
import { formatDate } from "../../utils/utils";

export const Home = () => {

  const navigate = useNavigate();

  const [birthdayMembers, setBirthdayMembers] = useState([]);

  const { modal, modalAlert } = useModal();

  useEffect(() => {
    const fetchBirthdayMembers = async () => {
      try {
        const { data } = await axios.get(base_url + "member-birthday", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        console.log(data)
        setBirthdayMembers(data);
      } catch (err) {
        console.log(err)
        modalAlert(err.response?.data?.message || "Erro ao buscar aniversariantes");
      } finally {
      }
    };

    fetchBirthdayMembers();
  }, []);

  return (
    <div className="w-screen h-screen flex bg-zinc-950 text-zinc-100 overflow-hidden">
      {modal}
      <Sidebar />
      <div className="w-full h-full flex flex-col py-2 px-4 gap-3">
        <div className="h-1/2 w-full flex flex-col bg-zinc-900/40 rounded-lg p-5 gap-3">
          <div className="flex items-center justify-center w-full">
            <h1 className="text-xl font-bold">Aniversariantes do mês</h1>
          </div>
          <div className="flex w-full h-full">
            <div className="w-10 flex items-center justify-center hover:bg-zinc-700/80 rounded-lg cursor-pointer">
              <MdKeyboardArrowLeft size={24} className="text-zinc-100" />
            </div>
            <div className="flex-1 flex gap-3 justify-center items-center">
              {birthdayMembers.length != 0 ? birthdayMembers.map(member => {
                return (
                  <div className="w-4/12 h-full flex flex-col bg-zinc-800 rounded-lg p-4 font-bold overflow-hidden">
                    <div className="flex items-center justify-center mb-3 gap-2">
                      <h1 title={member.name} className="max-w-[80%] truncate">{member.name}</h1> | <span >{formatDate(member.birthDate)}</span>
                    </div>
                    <HorizontalDivider />
                    <div className=" flex items-center w-full h-full max-h-full justify-center">
                      {member.imagePath ? (
                        <img src={`${base_url}userImages/${member.id}.png`} alt={member.name}
                          className="w-5/12 rounded-md object-contain" />
                      ) :
                        <div className="flex w-full h-full items-center justify-center">
                          <p className="text-zinc-400">Sem foto</p>
                        </div>
                      }
                    </div>
                  </div>
                )
              })
                :
                (
                  <div className="w-4/12 h-full bg-zinc-800 rounded-lg flex flex-col items-center justify-center">
                    Sem aniversariantes este mês
                  </div>
                )
              }
            </div>
            <div className="w-10 flex items-center justify-center hover:bg-zinc-700/80 rounded-lg cursor-pointer">
              <MdKeyboardArrowRight size={24} className="text-zinc-100 " />
            </div>
          </div>
        </div>
        <div className="h-1/2 w-full">
          <section className="w-full h-full bg-zinc-900/40 rounded-lg shadow-lg flex flex-col items-center justify-center">
          </section>
        </div>
      </div>
    </div>
  )
}


export default Home
