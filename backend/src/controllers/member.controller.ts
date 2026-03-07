import { Request, Response } from "express";
import { createMember, deleteMember, getAllMembers, getCountMembers, getMemberById, updateMember } from "../repositories/member.repository";
import { Role } from "@prisma/client";
import upload from "../multerConfig";
import path from "path";
import fs from 'fs';
import { format } from "date-fns";
import ExcelJS from "exceljs";
import { incrementMemberAdded, incrementMemberRemoved } from "../repositories/statistics.repository";
import { toZonedTime } from "date-fns-tz";

export const create = async (req: Request, res: Response) => {
    try {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: "Erro ao processar o upload." });
            }

            const { id, name, email, birthDate, cpf, rg, baptismDate, memberSince, role, phone } = req.body;

            var {acceptTerms} = req.body;

            const imagePath = req.file ? `userImages/${req.file.filename}` : null;
            
            acceptTerms = acceptTerms == 'true' ? true : false;

            const {member, success, message} = await createMember({ id, name, email, birthDate, cpf, imagePath, rg, baptismDate, memberSince, role, phone, acceptTerms });

            if(!success) {
                return res.status(500).json({ error: "Erro ao criar membro", message });
            }
            
            if(member) {
                // Incrementa a estatística de membro adicionado
                const response = await incrementMemberAdded(member.id);

                if(!response.success) {
                    return res.status(500).json({ error: "Erro ao incrementar estatística" });
                }
            }

            res.status(201).json(member);
        });
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};

export const get_all = async (req: Request, res: Response) => {
    try {
        const members = await getAllMembers();
        res.status(200).send(members);
    } catch (error) {
        res.status(500).send({ error });
    }
}

export const get_member = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const member = await getMemberById(id);

        if (!member) {
            return res.status(404).send({ message: 'Membro não encontrado' });
        }

        res.status(200).send(member);

    } catch (error) {
        res.status(500).send({ error });
    }
}

export const update_member = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: "Erro ao processar o upload." });
            }

            // Busca o membro pelo ID
            const existingMember = await getMemberById(id);

            if (!existingMember) {
                return res.status(404).json({ error: "Membro não encontrado." });
            }

            let newData = { ...req.body };

            // Se houver upload de imagem, remover a antiga e atualizar o caminho
            if (req.file) {
                const newImagePath = `userImages/${req.file.filename}`;

                if (existingMember.imagePath) {
                    const oldImagePath = path.resolve(existingMember.imagePath);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                newData.imagePath = newImagePath;
            }

            var {acceptTerms} = req.body;
            acceptTerms = acceptTerms == 'true' ? true : false;

            newData.acceptTerms = acceptTerms;
            // Atualiza os dados do membro
            const updatedMember = await updateMember(id, newData);

            res.status(200).json(updatedMember);
        });
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};

export const delete_member = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const member = await deleteMember(id);

        if (member) {
            // Caminho do arquivo de imagem
            const imagePath = path.join(__dirname, '..', 'userImages', `${id}.png`);

            // Verifica se o arquivo existe antes de tentar excluí-lo
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            // Cria uma estatística de membro removido
            const response = await incrementMemberRemoved(member.id);

            if (!response.success) {
                return res.status(500).json({ error: "Erro ao incrementar estatística" });
            }

            return res.status(200).send(member);
        }

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).send({ message: 'Membro não encontrado' });
        }

        res.status(500).send({ error });
    }
};

// Função para formatar datas
const formatDate = (date: Date | null) => {
    if(date){
        
        const _date = (date).toISOString().split('T')[0];

        const day = _date.split('-')[2];
        const month = _date.split('-')[1];  
        const year = _date.split('-')[0];

        return `${day}/${month}/${year}`;
    }else {
        return '';
    }
} 

export const export_members_csv = async (req: Request, res: Response) => {
    try {
        const members = await getAllMembers();

        const tmpDir = path.join(__dirname, "../../tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const filePath = path.join(tmpDir, "members.csv");
        const writeStream = fs.createWriteStream(filePath);

        // Cabeçalho do CSV
        writeStream.write("Nome,Cargo,Email,CPF,RG,Telefone,Data de Batismo,Data de Nascimento,Membro desde,Aceitou termos de Imagem?\n");


        // Escrever os dados dos membros no CSV
        members.forEach((member) => {

            var role = 'Membro';

            switch (member.role) {
                case Role.MEMBER:
                    role = 'Membro';
                    break;
                case Role.PASTOR:
                    role = 'Pastor';
                    break;
                case Role.AUXILIARY:
                    role = 'Auxiliar';
                    break;
                case Role.DEACON:
                    role = 'Diácono';
                    break;
                case Role.ELDER:
                    role = 'Presbítero';
                    break;
                default:
                    role = 'Presbítero';
                    break;
            }

            const row = `${member.name},${role},${member.email},${member.cpf},${member.rg},${member.phone},${formatDate(member.baptismDate)},${formatDate(member.birthDate)},${formatDate(member.memberSince)},${member.acceptTerms ? 'Sim' : 'Não'}\n`;
            writeStream.write(row);
        });

        writeStream.end(() => {
            res.download(filePath, "members.csv", (err) => {
                if (err) {
                    console.error("Erro ao enviar o arquivo:", err);
                    res.status(500).json({ error: "Erro ao baixar o arquivo CSV" });
                }
                fs.unlinkSync(filePath); // Remove o arquivo após o download
            });
        });
    } catch (error) {
        console.error("Erro ao exportar CSV:", error);
        res.status(500).json({ error: "Erro interno ao exportar CSV" });
    }
};

export const exportToExcel = async (req: Request, res: Response) => {
    try {
        const members = await getAllMembers();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Membros");

        // Definir cabeçalhos
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Nome", key: "name", width: 30 },
            { header: "Cargo", key: "role", width: 20 },
            { header: "Email", key: "email", width: 30 },
            { header: "CPF", key: "cpf", width: 20 },
            { header: "RG", key: "rg", width: 20 },
            { header: "Telefone", key: "phone", width: 20 },
            { header: "Data de Batismo", key: "baptismDate", width: 15 },
            { header: "Data de Nascimento", key: "birthDate", width: 15 },
            { header: "Membro desde", key: "memberSince", width: 15 },
            { header: "Aceitou os termos de imagem?", key: "acceptTerms", width: 30 },
        ];

        // Adicionar dados
        members.forEach((member) => {

            var role = 'Membro';

            switch (member.role) {
                case Role.MEMBER:
                    role = 'Membro';
                    break;
                case Role.PASTOR:
                    role = 'Pastor';
                    break;
                case Role.AUXILIARY:
                    role = 'Auxiliar';
                    break;
                case Role.DEACON:
                    role = 'Diácono';
                    break;
                case Role.ELDER:
                    role = 'Presbítero';
                    break;
                default:
                    role = 'Presbítero';
                    break;
            }

            worksheet.addRow({
                id: member.id,
                name: member.name,
                role,
                email: member.email,
                cpf: member.cpf,
                rg: member.rg,
                phone: member.phone,
                baptismDate: member.baptismDate ? formatDate(member.baptismDate) : "",
                birthDate: member.birthDate ? formatDate(member.birthDate) : "",
                memberSince: member.memberSince ? formatDate(member.memberSince) : "",
                acceptTerms: member.acceptTerms ? 'Sim' : 'Não'
            });
        });

        // Criar diretório temporário se não existir
        const filePath = path.join(__dirname, "../../tmp/members.xlsx");
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        // Salvar o arquivo temporariamente
        await workbook.xlsx.writeFile(filePath);

        // Enviar o arquivo para download
        res.download(filePath, "members.xlsx", () => {
            fs.unlinkSync(filePath); // Remover o arquivo após o download
        });
    } catch (error) {
        console.error("Erro ao exportar para Excel:", error);
        res.status(500).json({ error: "Erro interno ao gerar o Excel" });
    }
};

export const get_birthday_people_of_month = async (req: Request, res: Response) => {
    try {
        const allMembers = await getAllMembers();

        const currentMonth = new Date().getMonth() + 1;
        
        const birthdayPeople = allMembers.filter(member => {
            const memberMonth = new Date(member.birthDate).getUTCMonth() + 1;

            return memberMonth === currentMonth;
        })

        if(!birthdayPeople) {
            return res.status(404).send({ message: 'Erro ao buscar anivesariantes' });
        }

        res.status(200).send(birthdayPeople);
    } catch (error) {
        res.status(500).send({ error });
    }
}

export const get_count_all_members = async (req: Request, res: Response) => {
    try {
        const members = await getCountMembers();
        res.status(200).send({ count: members });
    } catch (error) {
        res.status(500).send({ error });
    }
}