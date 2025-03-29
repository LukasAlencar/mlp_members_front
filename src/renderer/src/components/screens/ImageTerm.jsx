import Sidebar from "../Sidebar";
import { MdKeyboardArrowLeft } from 'react-icons/md';

export const ImageTerm = ({ name, cpf, handleCloseTerm }) => {

  return (
    <div className="w-full h-full bg-zinc-950 relative flex items-center justify-center text-center p-20 text-zinc-50 font-serif">
      <div onClick={() => handleCloseTerm()} className="absolute top-10 left-10 flex items-center cursor-pointer">
        <MdKeyboardArrowLeft size={30} />
        <span>
          Voltar
        </span>
      </div>
      <div className="w-8/12 flex flex-col items-center justify-center gap-5">
        <h1>TERMO DE PERMISSÃO DE USO DE IMAGEM</h1>
        <p>
          Eu, {name ? <span className="underline underline-offset-3">{name}</span> : <span className="text-red-500">NOME NÃO INFORMADO ( PREENCHA O CAMPO NOME ANTES DE LER O TERMO )</span> },
          portador(a) do CPF nº {cpf ? <span className="underline underline-offset-3">{cpf}</span> : <span className="text-red-500">CPF NÃO INFORMADO ( PREENCHA O CAMPO CPF ANTES DE LER O TERMO )</span>}, autorizo, de forma gratuita, a IGREJA Ministério Luz da Palavra, a utilizar minha imagem captada por meio de fotografias e/ou vídeos durante eventos, cultos, reuniões e demais atividades promovidas pela igreja.
        </p>
        <p>
          Declaro estar ciente de que essa autorização inclui o direito de uso da minha imagem para publicações nas redes sociais da igreja, materiais institucionais impressos e digitais, bem como em vídeos e outras formas de divulgação dentro e fora da instituição, sempre com o objetivo de promover atividades e eventos da igreja.
        </p>
        <p>
          Estou ciente de que a minha imagem não será utilizada para fins comerciais nem associada a conteúdos inadequados ou prejudiciais à minha honra e integridade.
        </p>
        <p>
          Esta autorização é concedida por prazo indeterminado, podendo ser revogada a qualquer momento mediante solicitação formal por escrito à administração da igreja.
        </p>
      </div>
    </div>
  )
}


export default ImageTerm
