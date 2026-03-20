import {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle
} from 'docx'
import { saveAs } from 'file-saver'
import { formatDatePTBR, formatRole } from './utils'

const IGREJA = 'Ministério Luz da Palavra'
const ENDERECO = 'Rua Sapucaí Mirim, 172 - Jd. Santo Eduardo'

const headerParagraphs = (titulo) => [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: IGREJA, bold: true, size: 28, font: 'Times New Roman' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: ENDERECO, size: 22, font: 'Times New Roman' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 320 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 1 } },
    children: []
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 480 },
    children: [new TextRun({ text: titulo, bold: true, size: 28, allCaps: true, font: 'Times New Roman' })]
  }),
]

const assinaturaParagraphs = () => [
  new Paragraph({ spacing: { before: 960 }, children: [new TextRun({ text: '', font: 'Times New Roman' })] }),
  new Paragraph({
    children: [new TextRun({ text: '____________________________________________', font: 'Times New Roman', size: 24 })]
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'Pastor Responsável — ' + IGREJA, size: 24, font: 'Times New Roman' })]
  }),
  new Paragraph({
    children: [new TextRun({
      text: `Data: ${new Date().toLocaleDateString('pt-BR')}`,
      size: 24,
      font: 'Times New Roman'
    })]
  }),
]

const textoParagraph = (texto) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 240, line: 360 },
  children: [new TextRun({ text: texto, size: 24, font: 'Times New Roman' })]
})

const textoBoldInline = (partes) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 240, line: 360 },
  children: partes.map(({ text, bold }) =>
    new TextRun({ text, bold: !!bold, size: 24, font: 'Times New Roman' })
  )
})

export const gerarDocxApresentacao = async (member) => {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        ...headerParagraphs('Carta de Apresentação'),

        textoParagraph('Aos pastores, presbíteros e irmãos em Cristo Jesus,'),

        textoBoldInline([
          { text: 'Apresentamos ao corpo de Cristo o(a) irmão(ã) ' },
          { text: member.name, bold: true },
          { text: ', portador(a) do CPF ' },
          { text: member.cpf, bold: true },
          { text: ', que exerce a função de ' },
          { text: formatRole(member.role), bold: true },
          { text: ' em nossa congregação, membro desde ' },
          { text: formatDatePTBR(member.memberSince) || 'data não informada', bold: true },
          { text: ' e batizado(a) em ' },
          { text: formatDatePTBR(member.baptismDate) || 'data não informada', bold: true },
          { text: '.' },
        ]),

        textoParagraph(
          'O(A) referido(a) irmão(ã) encontra-se em plena comunhão com esta igreja, gozando de boa ' +
          'reputação entre nós, razão pela qual o(a) recomendamos com alegria à fraternidade e ao ' +
          'acolhimento de toda a família de fé que o(a) receber.'
        ),

        textoParagraph('Rogamos ao Senhor que o(a) abençoe e o(a) guie em todos os seus caminhos.'),

        ...assinaturaParagraphs(),
      ]
    }]
  })

  const buffer = await Packer.toBlob(doc)
  saveAs(buffer, `carta-apresentacao-${member.name.replace(/ /g, '_')}.docx`)
}

export const gerarDocxMudanca = async (member) => {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        ...headerParagraphs('Carta de Mudança'),

        textoParagraph('Aos pastores, presbíteros e irmãos em Cristo Jesus,'),

        textoBoldInline([
          { text: 'Por meio desta, declaramos que o(a) irmão(ã) ' },
          { text: member.name, bold: true },
          { text: ', portador(a) do CPF ' },
          { text: member.cpf, bold: true },
          { text: ', exerceu a função de ' },
          { text: formatRole(member.role), bold: true },
          { text: ' em nossa congregação, tendo sido membro desde ' },
          { text: formatDatePTBR(member.memberSince) || 'data não informada', bold: true },
          { text: ' e batizado(a) em ' },
          { text: formatDatePTBR(member.baptismDate) || 'data não informada', bold: true },
          { text: '.' },
        ]),

        textoParagraph(
          'O(A) referido(a) irmão(ã) está se transferindo de nossa comunidade, saindo em paz e com a ' +
          'bênção desta igreja. Durante o tempo em que esteve conosco, demonstrou fidelidade, ' +
          'comprometimento e amor ao próximo.'
        ),

        textoParagraph(
          'Recomendamos o(a) com confiança à igreja que o(a) receber, pedindo ao Senhor que continue ' +
          'a guiar seus passos e que sua nova jornada seja repleta das bênçãos de Deus.'
        ),

        ...assinaturaParagraphs(),
      ]
    }]
  })

  const buffer = await Packer.toBlob(doc)
  saveAs(buffer, `carta-mudanca-${member.name.replace(/ /g, '_')}.docx`)
}
