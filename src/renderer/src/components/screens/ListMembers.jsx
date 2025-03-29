import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { base_url } from '../../services/config';
import { LoaderScreen } from '../LoaderScreen';
import Error from "./Error";
import MemberRow from "../MemberRow";
import { PiFileCsv, PiFileXls } from "react-icons/pi";
import useModal from "../Modal";


export const ListMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { modal, modalAlert } = useModal();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await axios.get(base_url + "member", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setMembers(data);
      } catch (err) {
        console.log(err)
        setError(err.response?.data?.message || "Erro ao buscar membros");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleRemove = (id) => {
    setMembers((prevMembers) => prevMembers.filter(member => member.id !== id));
  };

  const exportExcel = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(base_url + "member/export/excel", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        modalAlert("Erro ao baixar Excel");
        return
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "members.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      modalAlert("Erro ao baixar Excel:", error);
    }
  };

  const exportCSV = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(base_url + "member/export/csv", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        modalAlert("Erro ao baixar CSV");
        return
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "members.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      modalAlert("Erro ao baixar CSV:", error);
      return
    }
  }

  return (
    <div className="w-screen h-screen text-zinc-100 flex">
      {modal}
      <Sidebar />
      <div className="bg-zinc-950 w-full h-full overflow-hidden p-4">
        {loading ? (
          <LoaderScreen />
        ) : error ? (
          <Error>{error}</Error>
        ) : (
          <div className="overflow-x-auto rounded-lg w-full h-full overflow-auto">
            {members.length == 0 ? (
              <div className="w-full h-full flex text-zinc-100 bg-zinc-950 justify-center items-center" >
                <p className="text-3xl">
                  Nenhum membro cadastrado
                </p>
              </div>
            )
              :
              (<>
                <table className="w-full border border-zinc-700 rounded-lg shadow-lg">
                  <thead className="bg-zinc-800 text-white">
                    <tr>
                      <th className="px-4 py-2 border border-zinc-700">Nome</th>
                      <th className="px-4 py-2 border border-zinc-700">Cargo</th>
                      <th className="px-4 py-2 border border-zinc-700">Email</th>
                      <th className="px-4 py-2 border border-zinc-700">CPF</th>
                      <th className="px-4 py-2 border border-zinc-700">RG</th>
                      <th className="px-4 py-2 border border-zinc-700">Telefone</th>
                      <th className="px-4 py-2 border border-zinc-700">Data Batismo</th>
                      <th className="px-4 py-2 border border-zinc-700">Nascimento</th>
                      <th className="px-4 py-2 border border-zinc-700">Membro Desde</th>
                      <th className="px-4 py-2 border border-zinc-700">Termos de Imagem</th>
                      <th className="px-4 py-2 border border-zinc-700">Imagem</th>
                      <th className="px-4 py-2 border border-zinc-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <MemberRow onRemove={handleRemove} key={member.id} member={member} index={index} />
                    ))}
                  </tbody>
                </table>
                <div className="w-full flex justify-start items-center mt-3 gap-2">
                  <span onClick={exportCSV} title="Exportar CSV" className="w-30 h-30 p-1 border cursor-pointer border-zinc-500 rounded-lg hover:bg-zinc-800">
                    <PiFileCsv size={25} />
                  </span>
                  <span onClick={exportExcel} title="Exportar Excel" className="w-30 h-30 p-1 cursor-pointer border border-zinc-500 rounded-lg hover:bg-zinc-800">
                    <PiFileXls size={25} />
                  </span>
                </div>
              </>
              )}
          </div>
        )}
      </div>
    </div >
  );
};

export default ListMembers;
