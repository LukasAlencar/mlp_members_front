import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, "userImages"); // Garantindo que está dentro do backend

        // Verifica se a pasta existe, se não, cria
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const { id } = req.body;

        if (!id) {
            return cb(new Error("ID do membro não fornecido"), "");
        }

        const ext = path.extname(file.originalname); // Obtém a extensão do arquivo
        const filePath = path.resolve(__dirname, "userImages", `${id}${ext}`); // Caminho correto dentro do backend

        // Remove a foto antiga se já existir
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        cb(null, `${id}${ext}`);
    }
}); 


const upload = multer({storage});

export default upload;
