import { forwardRef } from "react";
import { formatDatePTBR, formatRole, getValidityDate } from '../utils/utils';
import FieldCardAlt from "./FieldCardAlt";

const MembershipCardExportBack = forwardRef(({ member }, ref) => {

  const validityDate = getValidityDate(member.updatedAt || member.createdAt);

  return (
    <div
      id="card"
      ref={ref}
      key={member.id}
      className="w-[720px] h-[400px] rounded-lg relative bg-card-bg bg-center bg-cover text-zinc-900 flex flex-col overflow-hidden z-20"
    >
      <main className="flex flex-col w-full truncate h-full justify-around gap-2 z-10">
        <div className="font-poppins font-bold text-white text-center text-sm">
          <p>
            Igreja Ministério Luz da Palavra
          </p>
          <span>CNPJ: 0000.0000/0000-00</span>
        </div>


        <div className="w-full text-center">
          <span className="w-full text-center text-white font-poppins text-[10px] font-bold">Pastor Presidente</span>
          <div className="w-full bg-white h-[100px] flex flex-col items-center justify-center mt-1">
          </div>
        </div>

        <div className="w-full h-1/3 flex items-center justify-center p-10">
          <div className="w-full flex-col flex justify-center items-start gap-4">
            <FieldCardAlt className="w-auto gap-0" label="Cargo:" isExport value={formatRole(member.role)} />
            <FieldCardAlt className="w-auto gap-0" label="Batismo:" isExport value={formatDatePTBR(member.baptismDate)} />
          </div>
          <div className="w-full flex-col flex items-start justify-center gap-4">
            <FieldCardAlt className="w-auto gap-0" label="Membro desde:" isExport value={formatDatePTBR(member.memberSince)} />
            <FieldCardAlt className="w-auto gap-0" label="Validade:" isExport value={validityDate} />
          </div>
        </div>

      </main>
    </div>
  );
});



export default MembershipCardExportBack;
