import { useNavigate } from "react-router";
import Sidebar from "../Sidebar";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import useModal from "../Modal";
import { base_url } from "../../services/config";
import axios from "axios";
import HorizontalDivider from "../HorizontalDivider";
import { formatDate, formatDatePTBR } from "../../utils/utils";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import confetes from "../../assets/confetes.png"

export const Home = () => {

  const [birthdayMembers, setBirthdayMembers] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const { modal, modalAlert } = useModal();

  const [totalMembers, setTotalMembers] = useState(0);

  const [statistics, setStatistics] = useState({ members_addeds: 0, members_removeds: 0 })

  const [selected, setSelected] = useState("all");

  const data = [
    {
      name: 'Membros',
      inners: statistics.members_addeds,
      outs: statistics.members_removeds,
      total: totalMembers,
    },
  ];

  const fetchAllStatistics = async () => {
    try {
      const { data } = await axios.get(base_url + "statistics", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setStatistics(data);
    } catch (err) {
      modalAlert(err.response?.data?.message || "Erro ao buscar o total de membros");
    } finally {
    }
  }

  const fetchStatisticsByMonth = async () => {
    try {
      const { data } = await axios.get(base_url + "statistics-month", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setStatistics(data);
    } catch (err) {
      modalAlert(err.response?.data?.message || "Erro ao buscar o total de membros");
    } finally {
    }
  }

  const fetchStatisticsByWeek = async () => {
    try {
      const { data } = await axios.get(base_url + "statistics-week", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setStatistics(data);
    } catch (err) {
      modalAlert(err.response?.data?.message || "Erro ao buscar o total de membros");
    } finally {
    }
  }

  const handleStatisticsMonth = () => {
    setSelected("month");
    fetchStatisticsByMonth();
  }


  const handleStatisticsWeek = () => {
    setSelected("week");
    fetchStatisticsByWeek();
  }


  const handleAllStatistics = () => {
    setSelected("all");
    fetchAllStatistics();
  }

  useEffect(() => {
    const fetchBirthdayMembers = async () => {
      try {
        const { data } = await axios.get(base_url + "member-birthday", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setBirthdayMembers(data);
      } catch (err) {
        modalAlert(err.response?.data?.message || "Erro ao buscar aniversariantes");
      } finally {
      }
    };

    const fetchAllMembers = async () => {
      try {
        const { data } = await axios.get(base_url + "member-count", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setTotalMembers(data.count);
      } catch (err) {
        modalAlert(err.response?.data?.message || "Erro ao buscar o total de membros");
      } finally {
      }
    }

    fetchAllStatistics();
    fetchAllMembers();
    fetchBirthdayMembers();
  }, []);

  const nextPage = () => {
    if (currentIndex + 1 < birthdayMembers.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPage = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="h-32 w-32 bg-zinc-800/50 rounded-lg p-2 flex flex-col items-center justify-center">
          {payload.map((item, index) => (
            <p className="label">{`${item.name} : ${item.value}`}</p>
          ))}
        </div>
      );
    }

    return null;
  };

  const formatDateDDMM= (date) => {
    const [day, month] = date.split("/");

    return `${day}/${month}`;
  }

  return (
    <div className="w-screen h-screen flex bg-zinc-950 text-zinc-100 overflow-hidden">
      {modal}
      <Sidebar />
      <div className="w-full h-full flex flex-col py-2 px-4 gap-3">
        <div className="h-1/2 w-full flex flex-col bg-zinc-900/40 rounded-lg p-5 gap-3">
          <div className="flex items-center justify-center w-full">
            <h1 className="text-xl text-zinc-100 font-bold">Aniversariantes do mês</h1>
          </div>
          <div className="flex w-full h-full gap-3">
            <div
              className={`w-10 flex items-center justify-center rounded-lg cursor-pointer ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-700/80"}`}
              onClick={prevPage}
            >
              <MdKeyboardArrowLeft size={24} className="text-zinc-100" />
            </div>
            <div className="flex-1 flex gap-3 justify-center items-center">
              {birthdayMembers.length !== 0 ? (
                birthdayMembers.slice(currentIndex, currentIndex + 3).map((member) => (
                  <div style={{backgroundImage: `url(${confetes})`}} key={member.id} className="bg-contain w-4/12 h-full flex flex-col bg-yellow-500 rounded-lg p-4 font-bold overflow-hidden relative">
                    <div className="flex items-center justify-center mb-3 gap-2 bg-yellow-500">
                      <h1 title={member.name} className="max-w-[80%] cursor-default truncate drop-shadow-md">{member.name}</h1> | <span className="cursor-default drop-shadow-md">{formatDateDDMM(formatDatePTBR(member.birthDate))}</span>
                    </div>
                    <HorizontalDivider />
                    <div className="flex items-center w-full h-full max-h-full justify-center">
                      {member.imagePath ? (
                        <div className="w-[150px] drop-shadow-lg h-[150px] items-center justify-center rounded-full overflow-hidden border-yellow-800 border-8">
                          <img src={`${base_url}userImages/${member.id}.png`} alt={member.name} className="w-full rounded-md object-contain object-center" />
                        </div>
                      ) : (
                        <div className="flex w-full h-full items-center justify-center">
                          <p className="text-zinc-400">Sem foto</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-4/12 h-full flex items-center justify-center">
                  Sem aniversariantes este mês
                </div>
              )}
            </div>
            <div
              className={`w-10 flex items-center justify-center rounded-lg cursor-pointer ${currentIndex + 3 >= birthdayMembers.length ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-700/80"
                }`}
              onClick={nextPage}
            >
              <MdKeyboardArrowRight size={24} className="text-zinc-100 " />
            </div>
          </div>
        </div>
        <div className="h-1/2 w-full">
          <section className="w-full h-full bg-zinc-900/40 rounded-lg shadow-lg flex gap-4 items-center justify-center">
            <div className="w-1/2 h-full pt-4">
              <ResponsiveContainer>
                <BarChart stackOffset="sign" data={data} barSize={100}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend />
                  <Bar dataKey="inners" fill="#4CAF50" name="Entraram" />
                  <Bar dataKey="outs" fill="#F44336" name="Sairam" />
                  <Bar dataKey="total" fill="#2196F3" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-full pt-4 flex flex-col gap-2">
              <button onClick={handleAllStatistics} className={`${selected == 'all' && 'bg-zinc-600/30'} border rounded-md p-2 border-zinc-600 text-sm text-zinc-300`}>Tudo</button>
              <button onClick={handleStatisticsMonth} className={`${selected == 'month' && 'bg-zinc-600/30'} border rounded-md p-2 border-zinc-600 text-sm text-zinc-300`}>Mensal</button>
              <button onClick={handleStatisticsWeek} className={`${selected == 'week' && 'bg-zinc-600/30'} border rounded-md p-2 border-zinc-600 text-sm text-zinc-300`}>Semanal</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}


export default Home
