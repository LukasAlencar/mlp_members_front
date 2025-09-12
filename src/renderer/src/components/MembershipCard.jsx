import { base_url } from "../services/config"
import headerImg from "../assets/cabecalhocarteirinha.png"
import { formatDatePTBR, formatRole } from './../utils/utils';
import FieldCard from "./FieldCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import MembershipCardExport from './MembershipCardExport';

export const MembershipCard = ({ member }) => {
  const componentRef = useRef();

  const handleDownloadPng = async () => {
    debugger

    if (!componentRef.current) return;

    try {
      const canvas = await html2canvas(componentRef.current, {
        scale: 3,          // aumenta a resolução
        useCORS: true,     // necessário para imagens externas
        backgroundColor: null, // mantém transparência, se quiser
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

  return (
    <>
      <div id="card" onClick={handleDownloadPng} key={member.id} className="w-[720px] h-[400px] bg-zinc-50 rounded-lg text-zinc-900 flex flex-col overflow-hidden">
        <header className="w-full h-1/2 flex items-center bg-zinc-900">
          <div className="w-[70%] h-full flex items-center justify-center">
            <img src={headerImg} alt="" />
          </div>
          <div className="w-[30%] h-full flex items-center justify-center">
            <div className="w-[150px] h-[200px] relative">
              <div className="w-[150px] h-[200px] overflow-hidden rounded-lg border-2 border-zinc-800 bg-zinc-800 absolute top-10 left-0">
                <img src={`${base_url}userImages/${member.id}.png`} alt="Carteirinha de membro" className="w-full h-full rounded-lg" />
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
              <FieldCard className="w-[70%] h-[40px]" label="Nome:" value={member.name} />
              <FieldCard className="w-[30%] h-[40px]" label="Telefone:" value={member.phone} />
            </div>
            <div className="w-full flex gap-2 justify-around mt-5">
              <FieldCard className="w-[23%] h-[40px]" label="RG:" value={member.rg} />
              <FieldCard className="w-[23%] h-[40px]" label="CPF:" value={member.cpf} />
              <FieldCard className="w-[18%] h-[40px]" label="Data Nascimento:" value={formatDatePTBR(member.birthDate)} />
              <FieldCard className="w-[18%] h-[40px]" label="Data Batismo:" value={formatDatePTBR(member.baptismDate)} />
              <FieldCard className="w-[18%] h-[40px]" label="Membro desde:" value={formatDatePTBR(member.memberSince)} />
            </div>
          </div>
        </main>
      </div>
      <div className="absolute left-[-999px] pointer-events-none top-0">
        <MembershipCardExport ref={componentRef} member={member}/>
      </div>
    </>
  )
}


export default MembershipCard
