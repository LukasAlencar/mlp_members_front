import { forwardRef } from "react";
import FieldCard from "./FieldCard";
import headerImg from "../assets/cabecalhocarteirinha.png";
import { base_url } from "../services/config";
import { formatDatePTBR, formatRole } from './../utils/utils';

const MembershipCardExport = forwardRef(({ member }, ref) => {
  return (
    <div
      id="card"
      ref={ref}
      key={member.id}
      className="w-[720px] h-[400px] bg-zinc-50 rounded-lg text-zinc-900 flex flex-col overflow-hidden"
    >
      <header className="w-full h-1/2 flex items-center bg-zinc-900">
        <div className="w-[70%] h-full flex items-center justify-center">
          <img src={headerImg} alt="" />
        </div>
        <div className="w-[30%] h-full flex items-center justify-center">
          <div className="w-[150px] h-[200px] relative">
            <div className="w-[150px] h-[200px] overflow-hidden rounded-lg border-2 border-zinc-800 bg-zinc-800 absolute top-10 left-0">
              <img
                src={`${base_url}userImages/${member.id}.png`}
                alt="Carteirinha de membro"
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-col w-full h-1/2 gap-2 p-2 px-5">
        <h1 className="font-bold text-2xl text-center font-sans text-zinc-900">
          {formatRole(member.role).toUpperCase()}
        </h1>
        <div className="w-full h-full flex flex-col">
          <div className="w-full flex gap-2 mb-3">
            <FieldCard className="w-[70%] h-[40px]" label="Nome:" value={member.name} isExport />
            <FieldCard className="w-[30%] h-[40px]" label="Telefone:" value={member.phone} isExport />
          </div>
          <div className="w-full flex gap-2 justify-around mt-5">
            <FieldCard className="w-[23%] h-[40px]" label="RG:" value={member.rg} isExport />
            <FieldCard className="w-[23%] h-[40px]" label="CPF:" value={member.cpf} isExport />
            <FieldCard className="w-[18%] h-[40px]" label="Data Nascimento:" value={formatDatePTBR(member.birthDate)} isExport />
            <FieldCard className="w-[18%] h-[40px]" label="Data Batismo:" value={formatDatePTBR(member.baptismDate)} isExport />
            <FieldCard className="w-[18%] h-[40px]" label="Membro desde:" value={formatDatePTBR(member.memberSince)} isExport />
          </div>
        </div>
      </main>
    </div>
  );
});

export default MembershipCardExport;
