import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

export const backup = async (req: Request, res: Response) => {
  const tempPath = path.resolve(
    process.cwd(),
    "prisma",
    `backup-temp-${Date.now()}.db`
  );

  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return res.status(500).json({ error: "DATABASE_URL não definido" });
    }

    const dbRelativePath = databaseUrl.replace("file:", "");
    const dbPath = path.resolve(process.cwd(), "prisma", dbRelativePath);

    if (!fs.existsSync(dbPath)) {
      return res.status(404).json({ error: "Banco de dados não encontrado" });
    }

    // cria backup consistente
    const db = new Database(dbPath);
    db.exec(`VACUUM INTO '${tempPath.replace(/\\/g, "/")}'`);
    db.close();

    if (!fs.existsSync(tempPath)) {
      return res.status(500).json({ error: "Falha ao gerar backup" });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${timestamp}.db`;

    const stat = fs.statSync(tempPath);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", stat.size);

    const stream = fs.createReadStream(tempPath);

    stream.pipe(res);

    // remove o arquivo quando terminar o envio
    res.on("finish", () => {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    });

    stream.on("error", (err) => {
      console.error("Erro no stream:", err);

      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

      if (!res.headersSent) {
        res.status(500).json({ error: "Erro ao enviar backup" });
      }
    });

  } catch (error) {
    console.error("Erro no backup:", error);

    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    if (!res.headersSent) {
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
};
