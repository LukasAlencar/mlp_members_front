// member.controller.ts

import { Request, Response } from "express";
import { createMember, deleteMember, getAllMembers, getCountMembers, getMemberById, updateMember } from "../repositories/member.repository";
import { CivilStatus, Role } from "@prisma/client";
import upload from "../multerConfig";
import path from "path";
import fs from 'fs';
import ExcelJS from "exceljs";
import { incrementMemberRemoved } from "../repositories/statistics.repository";
import cuid from "cuid";
import cloudinary from "../config/cloudinary";

const log = (level: 'info' | 'error' | 'warn', context: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 23);
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  const line = `[${timestamp}] [${level}] [${context}] ${message}${dataStr}`;
  const logPath = process.env.LOG_PATH;
  if (logPath) fs.appendFileSync(logPath, line + '\n');
  console.log(line);
};

const streamUpload = (buffer: Buffer, publicId: string) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "mlp_members", public_id: publicId, overwrite: true },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

export const create = async (req: Request, res: Response) => {
  log('info', 'create', 'Iniciando criação de membro');
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        log('error', 'create', 'Erro no upload de imagem', { error: err.message });
        return res.status(400).json({ error: "Erro no upload" });
      }

      let imageUrl = null;
      let imagePublicId = null;

      if (req.file) {
        try {
          const publicId = req.body.id || cuid();
          log('info', 'create', 'Enviando imagem para Cloudinary', { publicId });
          const result: any = await streamUpload(req.file.buffer, publicId);
          imageUrl = result.secure_url;
          imagePublicId = result.public_id;
          log('info', 'create', 'Imagem enviada com sucesso', { imageUrl });
        } catch (error: any) {
          log('error', 'create', 'Erro ao enviar imagem para Cloudinary', { error: error.message });
          return res.status(500).json({ error: "Erro ao enviar imagem" });
        }
      }

      const { id, name, email, birthDate, cpf, rg, baptismDate, memberSince, role, civilStatus, phone, acceptTerms } = req.body;
      const acceptTermsValue = acceptTerms == 'true' ? true : false;

      const member = await createMember({ id, name, email, birthDate, cpf, rg, baptismDate, memberSince, role, civilStatus, phone, imagePath: imageUrl, imagePublicId, acceptTerms: acceptTermsValue });
      log('info', 'create', 'Membro criado com sucesso', { id: member.member?.id });

      res.status(201).json(member);
    });
  } catch (error: any) {
    log('error', 'create', 'Erro interno ao criar membro', { error: error.message });
    res.status(500).json({ error: "Erro interno" });
  }
};

export const get_all = async (req: Request, res: Response) => {
  log('info', 'get_all', 'Buscando todos os membros');
  try {
    const members = await getAllMembers();
    log('info', 'get_all', `${members.length} membros encontrados`);
    res.status(200).send(members);
  } catch (error: any) {
    log('error', 'get_all', 'Erro ao buscar membros', { error: error.message });
    res.status(500).send({ error });
  }
};

export const get_member = async (req: Request, res: Response) => {
  const { id } = req.params;
  log('info', 'get_member', 'Buscando membro por ID', { id });
  try {
    const member = await getMemberById(id);
    if (!member) {
      log('warn', 'get_member', 'Membro não encontrado', { id });
      return res.status(404).send({ message: 'Membro não encontrado' });
    }
    log('info', 'get_member', 'Membro encontrado', { id });
    res.status(200).send(member);
  } catch (error: any) {
    log('error', 'get_member', 'Erro ao buscar membro', { id, error: error.message });
    res.status(500).send({ error });
  }
};

export const update_member = async (req: Request, res: Response) => {
  const { id } = req.params;
  log('info', 'update_member', 'Iniciando atualização de membro', { id });
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        log('error', 'update_member', 'Erro no upload de imagem', { id, error: err.message });
        return res.status(400).json({ error: "Erro ao processar o upload." });
      }

      const existingMember = await getMemberById(id);
      if (!existingMember) {
        log('warn', 'update_member', 'Membro não encontrado para atualização', { id });
        return res.status(404).json({ error: "Membro não encontrado." });
      }

      let newData = { ...req.body };

      if (req.file) {
        log('info', 'update_member', 'Enviando nova imagem para Cloudinary', { id });
        const result: any = await streamUpload(req.file.buffer, id);
        newData.imagePath = result.secure_url;
        newData.imagePublicId = result.public_id;
        log('info', 'update_member', 'Imagem atualizada com sucesso', { id, imageUrl: newData.imagePath });
      }

      var { acceptTerms } = req.body;
      acceptTerms = acceptTerms == 'true' ? true : false;
      newData.acceptTerms = acceptTerms;

      const updatedMember = await updateMember(id, newData);
      log('info', 'update_member', 'Membro atualizado com sucesso', { id });

      res.status(200).json(updatedMember);
    });
  } catch (error: any) {
    log('error', 'update_member', 'Erro interno ao atualizar membro', { id, error: error.message });
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const delete_member = async (req: Request, res: Response) => {
  const { id } = req.params;
  log('info', 'delete_member', 'Iniciando remoção de membro', { id });
  try {
    const member = await deleteMember(id);
    if (member) {
      if (member.imagePublicId) {
        log('info', 'delete_member', 'Removendo imagem do Cloudinary', { publicId: member.imagePublicId });
        await cloudinary.uploader.destroy(member.imagePublicId);
        log('info', 'delete_member', 'Imagem removida do Cloudinary');
      }

      const response = await incrementMemberRemoved(member.id);
      if (!response.success) {
        log('error', 'delete_member', 'Erro ao incrementar estatística de remoção', { id });
        return res.status(500).json({ error: "Erro ao incrementar estatística" });
      }

      log('info', 'delete_member', 'Membro removido com sucesso', { id });
      return res.status(200).send(member);
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      log('warn', 'delete_member', 'Membro não encontrado para remoção', { id });
      return res.status(404).send({ message: 'Membro não encontrado' });
    }
    log('error', 'delete_member', 'Erro interno ao remover membro', { id, error: error.message });
    res.status(500).send({ error });
  }
};

const formatDate = (date: Date | null) => {
  if (date) {
    const _date = (date).toISOString().split('T')[0];
    const day = _date.split('-')[2];
    const month = _date.split('-')[1];
    const year = _date.split('-')[0];
    return `${day}/${month}/${year}`;
  } else {
    return '';
  }
};

export const export_members_csv = async (req: Request, res: Response) => {
  log('info', 'export_members_csv', 'Iniciando exportação CSV');
  try {
    const members = await getAllMembers();
    log('info', 'export_members_csv', `${members.length} membros para exportar`);

    const tmpDir = path.join(__dirname, "../../tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const filePath = path.join(tmpDir, "members.csv");
    const writeStream = fs.createWriteStream(filePath);

    writeStream.write("Nome,Cargo,Estado Cívil,Email,CPF,RG,Telefone,Data de Batismo,Data de Nascimento,Membro desde,Aceitou termos de Imagem?\n");

    members.forEach((member) => {
      var role = 'Membro';
      switch (member.role) {
        case Role.MEMBER: role = 'Membro'; break;
        case Role.PASTOR: role = 'Pastor'; break;
        case Role.AUXILIARY: role = 'Auxiliar'; break;
        case Role.DEACON: role = 'Diácono'; break;
        case Role.ELDER: role = 'Presbítero'; break;
        default: role = 'Presbítero'; break;
      }

      var civilStatus = 'Solteiro';
      switch (member.civilStatus) {
        case CivilStatus.SINGLE: civilStatus = 'Solteiro'; break;
        case CivilStatus.MARRIED: civilStatus = 'Casado'; break;
        case CivilStatus.DIVORCED: civilStatus = 'Divorciado'; break;
        case CivilStatus.WIDOWED: civilStatus = 'Viúvo'; break;
      }

      const row = `${member.name},${role},${civilStatus},${member.email},${member.cpf},${member.rg},${member.phone},${formatDate(member.baptismDate)},${formatDate(member.birthDate)},${formatDate(member.memberSince)},${member.acceptTerms ? 'Sim' : 'Não'}\n`;
      writeStream.write(row);
    });

    writeStream.end(() => {
      log('info', 'export_members_csv', 'Arquivo CSV gerado, iniciando download', { filePath });
      res.download(filePath, "members.csv", (err) => {
        if (err) {
          log('error', 'export_members_csv', 'Erro ao enviar arquivo CSV', { error: err.message });
          res.status(500).json({ error: "Erro ao baixar o arquivo CSV" });
        }
        fs.unlinkSync(filePath);
        log('info', 'export_members_csv', 'Arquivo CSV removido após download');
      });
    });
  } catch (error: any) {
    log('error', 'export_members_csv', 'Erro interno ao exportar CSV', { error: error.message });
    res.status(500).json({ error: "Erro interno ao exportar CSV" });
  }
};

export const exportToExcel = async (req: Request, res: Response) => {
  log('info', 'exportToExcel', 'Iniciando exportação Excel');
  try {
    const members = await getAllMembers();
    log('info', 'exportToExcel', `${members.length} membros para exportar`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Membros");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nome", key: "name", width: 30 },
      { header: "Cargo", key: "role", width: 20 },
      { header: "Estado Cívil", key: "civilStatus", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "CPF", key: "cpf", width: 20 },
      { header: "RG", key: "rg", width: 20 },
      { header: "Telefone", key: "phone", width: 20 },
      { header: "Data de Batismo", key: "baptismDate", width: 15 },
      { header: "Data de Nascimento", key: "birthDate", width: 15 },
      { header: "Membro desde", key: "memberSince", width: 15 },
      { header: "Aceitou os termos de imagem?", key: "acceptTerms", width: 30 },
    ];

    members.forEach((member) => {
      var role = 'Membro';
      switch (member.role) {
        case Role.MEMBER: role = 'Membro'; break;
        case Role.PASTOR: role = 'Pastor'; break;
        case Role.AUXILIARY: role = 'Auxiliar'; break;
        case Role.DEACON: role = 'Diácono'; break;
        case Role.ELDER: role = 'Presbítero'; break;
        default: role = 'Presbítero'; break;
      }

      var civilStatus = 'Solteiro';
      switch (member.civilStatus) {
        case CivilStatus.SINGLE: civilStatus = 'Solteiro'; break;
        case CivilStatus.MARRIED: civilStatus = 'Casado'; break;
        case CivilStatus.DIVORCED: civilStatus = 'Divorciado'; break;
        case CivilStatus.WIDOWED: civilStatus = 'Viúvo'; break;
      }

      worksheet.addRow({
        id: member.id,
        name: member.name,
        role,
        civilStatus,
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

    const filePath = path.join(__dirname, "../../tmp/members.xlsx");
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    await workbook.xlsx.writeFile(filePath);
    log('info', 'exportToExcel', 'Arquivo Excel gerado, iniciando download', { filePath });

    res.download(filePath, "members.xlsx", () => {
      fs.unlinkSync(filePath);
      log('info', 'exportToExcel', 'Arquivo Excel removido após download');
    });
  } catch (error: any) {
    log('error', 'exportToExcel', 'Erro interno ao exportar Excel', { error: error.message });
    res.status(500).json({ error: "Erro interno ao gerar o Excel" });
  }
};

export const get_birthday_people_of_month = async (req: Request, res: Response) => {
  log('info', 'get_birthday_people_of_month', 'Buscando aniversariantes do mês');
  try {
    const allMembers = await getAllMembers();
    const currentMonth = new Date().getMonth() + 1;
    log('info', 'get_birthday_people_of_month', `Mês atual: ${currentMonth}`);

    const birthdayPeople = allMembers.filter(member => {
      const memberMonth = new Date(member.birthDate).getUTCMonth() + 1;
      return memberMonth === currentMonth;
    });

    if (!birthdayPeople) {
      log('warn', 'get_birthday_people_of_month', 'Erro ao filtrar aniversariantes');
      return res.status(404).send({ message: 'Erro ao buscar aniversariantes' });
    }

    log('info', 'get_birthday_people_of_month', `${birthdayPeople.length} aniversariantes encontrados`);
    res.status(200).send(birthdayPeople);
  } catch (error: any) {
    log('error', 'get_birthday_people_of_month', 'Erro ao buscar aniversariantes', { error: error.message });
    res.status(500).send({ error });
  }
};

export const get_count_all_members = async (req: Request, res: Response) => {
  log('info', 'get_count_all_members', 'Buscando contagem de membros');
  try {
    const members = await getCountMembers();
    log('info', 'get_count_all_members', `Total de membros: ${members}`);
    res.status(200).send({ count: members });
  } catch (error: any) {
    log('error', 'get_count_all_members', 'Erro ao buscar contagem', { error: error.message });
    res.status(500).send({ error });
  }
};
