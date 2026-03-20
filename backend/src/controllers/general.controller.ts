import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const backup = async (req: Request, res: Response) => {
  try {
    const dbRelativePath = process.env.DATABASE_URL?.replace("file:", "") ?? "";
    const prismaDir = path.resolve(process.cwd(), "prisma");
    const dbPath = path.resolve(prismaDir, dbRelativePath);

    if (!dbPath || !fs.existsSync(dbPath)) {
      return res.status(404).json({ error: "Banco de dados não encontrado" });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${timestamp}.db`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", fs.statSync(dbPath).size);

    const fileStream = fs.createReadStream(dbPath);
    fileStream.pipe(res);

    fileStream.on("error", () => {
      res.status(500).json({ error: "Erro ao ler o banco de dados" });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
