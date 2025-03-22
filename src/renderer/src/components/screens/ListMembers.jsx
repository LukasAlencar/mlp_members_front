import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { base_url } from '../../services/config';
import { LoaderScreen } from '../LoaderScreen';
import Error from "./Error";
import MemberRow from "../MemberRow";



export const ListMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="w-screen h-screen text-zinc-100 flex">
      <Sidebar />
      <div className="bg-zinc-950 w-full h-full overflow-hidden p-4">
        {loading ? (
          <LoaderScreen />
        ) : error ? (
          <Error>{error}</Error>
        ) : (
          <div className="overflow-x-auto rounded-lg overflow-hidden">
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
                  <th className="px-4 py-2 border border-zinc-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <MemberRow onRemove={handleRemove} key={member.id} member={member} index={index}/>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListMembers;
