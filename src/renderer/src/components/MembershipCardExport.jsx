import { forwardRef } from "react";
import headerImg from "../assets/cabecalhocarteirinha.png";
import { formatCivilStatus, formatDatePTBR } from './../utils/utils';
import FieldCardAlt from "./FieldCardAlt";

const MembershipCardExport = forwardRef(({ member }, ref) => {
  return (
    <div
      id="card"
      ref={ref}
      key={member.id}
      className="w-[720px] h-[400px] rounded-lg relative bg-card-bg bg-center bg-cover text-zinc-900 flex flex-col overflow-hidden z-20"
    >
      <header className="w-full h-2/6 flex items-center pt-5">
        <div className="w-full h-full flex items-start justify-center">
          <img src={headerImg} alt="logo mlp" className="w-72 " />
        </div>

      </header>
      <main className="flex w-full truncate h-full gap-2 py-5 px-10 ">
        <div className="w-2/3 h-full flex flex-col justify-start items-start gap-1">
          <div className="flex flex-col max-w-full truncate flex-1 h-full justify-center items-start gap-5">
            <FieldCardAlt className="" label="Nome:" value={member.name} isExport />
            <div className="flex justify-center gap-10 items-center">
              <FieldCardAlt className="" label="CPF:" value={member.cpf} isExport />
              <FieldCardAlt className="" label="Data de nasc.:" value={formatDatePTBR(member.birthDate)} isExport />
            </div>
            <FieldCardAlt className="" label="Estado Civil:" value={formatCivilStatus(member.civilStatus)} isExport />
          </div>
        </div>
        <div className="flex w-1/3 h-full justify-end">
          <div className=" h-full flex items-center justify-center">
            <div className="w-[90%] relative h-full flex items-center justify-center">
              <div className="aspect-[3/4] rounded-lg border-2 border-zinc-800 bg-zinc-800">
                <img src={member.imagePath} alt="Carteirinha de membro" className="w-full h-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});



export default MembershipCardExport;
