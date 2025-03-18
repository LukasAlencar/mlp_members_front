import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import InputMask from 'react-input-mask';

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
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setMember((prevMember) => ({
      ...prevMember,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = () => {
    console.log(member)
  }

  return (
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
              <div className="w-5/12">
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
              </div>
              <div className="w-7/12">
                <label className="text-white block mb-2" htmlFor="image">Imagem</label>
                <input
                  className="bg-zinc-700 text-white rounded w-full py-2 px-3"
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button onClick={handleSubmit} className="bg-zinc-500 hover:bg-zinc-600 text-white py-2 px-4 rounded">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterMember;
