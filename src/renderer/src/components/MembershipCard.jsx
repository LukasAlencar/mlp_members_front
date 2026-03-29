import { base_url } from "../services/config"
import headerImg from "../assets/cabecalhocarteirinha.png"
import { formatCivilStatus, formatDatePTBR, formatRole, getValidityDate } from './../utils/utils';
import FieldCardAlt from "./FieldCardAlt";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import MembershipCardExport from './MembershipCardExport';
import MembershipCardExportBack from './MembershipCardExportBack';

import bg from '../assets/bg-carteirinha.png';

export const MembershipCard = ({ member }) => {
  const componentRef = useRef();
  const componentBackRef = useRef();


  const handleDownloadPng = async (side) => {
    debugger

    let component = side === 'front' ? componentRef : componentBackRef;

    if (!component.current) return;
    await document.fonts.ready;
    try {
      const canvas = await html2canvas(component.current, {
        scale: 3,          // aumenta a resolução
        useCORS: true,     // necessário para imagens externas
        backgroundColor: null, // mantém transparência, se quiser
        logging: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "carteirinha.png";
      link.click();
    } catch (err) {
      console.error("Erro ao gerar PNG:", err);
    }
  };

  const handleDownloadJpeg = async () => {
    const element = componentRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true, // necessário se tiver imagens externas
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0); // 1.0 = qualidade máxima

    // Criar link e forçar o download
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "carteirinha.jpeg";
    link.click();
  };

  const handleDownloadPdf = async () => {
    const element = componentRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true, // Permitir imagens externas
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [720, 400],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 720, 400);
    pdf.save("carteirinha.pdf");
  };


  const validityDate = getValidityDate(member.updatedAt || member.createdAt);

  return (
    <div className=" flex gap-2 justify-center items-center">
      <div id="card" onClick={() => handleDownloadPng('front')} title="Baixar carteirinha" key={member.id} className="w-[720px] h-[400px] bg-card-bg bg-center bg-cover relative rounded-lg text-zinc-900 flex flex-col overflow-hidden cursor-pointer">

        <header className="w-full h-2/6 flex items-center z-10 pt-5">
          <div className="w-full h-full flex items-start justify-center">
            <img src={headerImg} alt="logo mlp" className="w-72 " />
          </div>

        </header>
        <main className="flex w-full overflow-hidden truncate h-full gap-2 py-5 px-10 z-10">
          <div className="w-2/3 h-full flex flex-col justify-start items-start gap-1">
            <div className="flex flex-col max-w-full truncate flex-1 h-full justify-center items-start gap-4">
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
                <div className="aspect-[3/4] overflow-hidden rounded-lg border-2 border-zinc-800 bg-zinc-800">
                  <img src={member.imagePath} alt="Carteirinha de membro" className="w-full h-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="border-white h-[380px] rounded-xl border"></div>

      <div id="card" onClick={() => handleDownloadPng('back')} title="Baixar carteirinha" key={member.id + "-back"} className="w-[720px] h-[400px] bg-card-bg bg-center bg-cover relative rounded-lg text-zinc-900 flex flex-col overflow-hidden cursor-pointer">

        <main className="flex flex-col w-full overflow-hidden truncate h-full justify-around gap-2 z-10">
          <div className="font-poppins font-bold text-white text-center text-sm">
            <p>
              Igreja Ministério Luz da Palavra
            </p>
            <span>CNPJ: 0000.0000/0000-00</span>
          </div>


          <div className="w-full text-center">
            <span className="w-full text-center text-white font-poppins text-xs font-bold">Pastor Presidente</span>
            <div className="w-full bg-white h-[100px] flex flex-col items-center justify-center">
            </div>
          </div>

          <div className="w-full h-1/3 flex items-center justify-center p-10">
            <div className="w-full flex-col flex justify-center items-start gap-4">
              <FieldCardAlt className="w-auto gap-0" label="Cargo:" value={formatRole(member.role)} />
              <FieldCardAlt className="w-auto gap-0" label="Batismo:" value={formatDatePTBR(member.baptismDate)} />
            </div>
            <div className="w-full flex-col flex items-start justify-center gap-4">
              <FieldCardAlt className="w-auto gap-0" label="Membro desde:" value={formatDatePTBR(member.memberSince)} />
              <FieldCardAlt className="w-auto gap-0" label="Validade:" value={validityDate} />
            </div>
          </div>

        </main>
      </div>
      <div className="absolute left-[-999px] pointer-events-none top-0">
        <MembershipCardExport ref={componentRef} member={member} />
      </div>
      <div className="absolute left-[-999px] pointer-events-none top-0">
        <MembershipCardExportBack ref={componentBackRef} member={member} />
      </div>
    </div>
  )
}


export default MembershipCard
