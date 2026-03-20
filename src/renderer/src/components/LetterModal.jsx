// src/components/LetterModal.jsx

import { useState, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { formatDatePTBR, formatRole } from '../utils/utils'
import { gerarDocxApresentacao, gerarDocxMudanca } from '../utils/generateLetter'


const gerarCartaApresentacao = (member) => `
  <div style="font-family: Times New Roman, serif; padding: 40px; color: #000;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase;">Ministério Luz da Palavra</h2>
      <p style="font-size: 13px;">Rua Sapucaí Mirim, 172 - Jd. Santo Eduardo</p>
      <hr style="margin: 10px 0;" />
      <h3 style="font-size: 16px; font-weight: bold; text-transform: uppercase; margin-top: 10px;">Carta de Apresentação</h3>
    </div>

    <p style="font-size: 14px; text-align: justify; line-height: 1.8;">
      Aos pastores, presbíteros e irmãos em Cristo Jesus,
    </p>

    <p style="font-size: 14px; text-align: justify; line-height: 1.8; margin-top: 15px;">
      Apresentamos ao corpo de Cristo o(a) irmão(ã) <strong>${member.name}</strong>,
      portador(a) do CPF <strong>${member.cpf}</strong>, que exerce a função de
      <strong>${formatRole(member.role)}</strong> em nossa congregação, membro desde
      <strong>${formatDatePTBR(member.memberSince) || 'data não informada'}</strong>
      e batizado(a) em <strong>${formatDatePTBR(member.baptismDate) || 'data não informada'}</strong>.
    </p>

    <p style="font-size: 14px; text-align: justify; line-height: 1.8; margin-top: 15px;">
      O(A) referido(a) irmão(ã) encontra-se em plena comunhão com esta igreja, gozando de boa reputação
      entre nós, razão pela qual o(a) recomendamos com alegria à fraternidade e ao acolhimento de
      toda a família de fé que o(a) receber.
    </p>

    <p style="font-size: 14px; text-align: justify; line-height: 1.8; margin-top: 15px;">
      Rogamos ao Senhor que o(a) abençoe e o(a) guie em todos os seus caminhos.
    </p>

    <div style="margin-top: 60px; font-size: 14px;">
      <p>____________________________________________</p>
      <p>Pastor Responsável — Ministério Luz da Palavra</p>
      <p style="margin-top: 10px;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  </div>
`

const gerarCartaMudanca = (member) => `
  <div style="font-family: Times New Roman, serif; padding: 40px; color: #000;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase;">Ministério Luz da Palavra</h2>
      <p style="font-size: 13px;">Rua Sapucaí Mirim, 172 - Jd. Santo Eduardo</p>
      <hr style="margin: 10px 0;" />
      <h3 style="font-size: 16px; font-weight: bold; text-transform: uppercase; margin-top: 10px;">Carta de Mudança</h3>
    </div>

    <p style="font-size: 14px; text-align: justify; line-height: 1.8;">
      Aos pastores, presbíteros e irmãos em Cristo Jesus,
    </p>

    <p style="font-size: 14px; text-align: justify; line-height: 1.8; margin-top: 15px;">
      Por meio desta, declaramos que o(a) irmão(ã) <strong>${member.name}</strong>,
      portador(a) do CPF <strong>${member.cpf}</strong>, exerceu a função de
      <strong>${formatRole(member.role)}</strong> em nossa congregação, tendo sido
      membro desde <strong>${formatDatePTBR(member.memberSince) || 'data não informada'}</strong>
      e batizado(a) em <strong>${formatDatePTBR(member.baptismDate) || 'data não informada'}</strong>.
    </p>

    <p style="font-size: 14px; text-align: justify; line-height: 1.8; margin-top: 15px;">
      O(A) referido(a) irmão(ã) está se transferindo de nossa comunidade, saindo em paz e com a
      bênção desta igreja. Durante o tempo em que esteve conosco, demonstrou fidelidade,
      comprometimento e amor ao próximo.
    </p>

    <p style="font-size: 14px; text-align: justify; line-height: 1.8; margin-top: 15px;">
      Recomendamos o(a) com confiança à igreja que o(a) receber, pedindo ao Senhor que continue
      a guiar seus passos e que sua nova jornada seja repleta das bênçãos de Deus.
    </p>

    <div style="margin-top: 60px; font-size: 14px;">
      <p>____________________________________________</p>
      <p>Pastor Responsável — Ministério Luz da Palavra</p>
      <p style="margin-top: 10px;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  </div>
`

const LetterModal = ({ member, type, onClose }) => {
  const contentRef = useRef(null)
  const [value, setValue] = useState(
    type === 'apresentacao'
      ? gerarCartaApresentacao(member)
      : gerarCartaMudanca(member)
  )

  const handleDownload = async () => {
    if (type === 'apresentacao') {
      await gerarDocxApresentacao(member)
    } else {
      await gerarDocxMudanca(member)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 rounded-lg w-[900px] max-h-[90vh] flex flex-col shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-700">
          <h2 className="text-white font-semibold text-lg">
            {type === 'apresentacao' ? 'Carta de Apresentação' : 'Carta de Mudança'} — {member.name}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-4">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            className="bg-white text-black rounded"
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Preview oculto para PDF */}
        <div
          ref={contentRef}
          style={{ position: 'absolute', left: '-9999px', top: 0, width: '794px', background: '#fff' }}
          dangerouslySetInnerHTML={{ __html: value }}
        />

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-700 text-white hover:bg-zinc-600"
          >
            Fechar
          </button>
          <button onClick={handleDownload} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">
            Baixar .docx
          </button>
        </div>
      </div>
    </div>
  )
}

export default LetterModal
