import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/prisma';
import bcrypt from 'bcrypt';

export const authenticate = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({ message: 'Email e Senha são obrigatórios' });
        }

        const user = await prisma.user.findFirst({
            where: {
                email,
            }
        })

        if (!user) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    name: user.name,
                    email
                },
                String(process.env.JWT_KEY),
                {
                    expiresIn: '3h'
                }
            )

            return res.status(200).send({ token });
        } else {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export const verifySession = async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({message: 'Token não informado'});
    }

    try {

        const _token = token.replace('Bearer ', '');
        const authenticated = jwt.verify(_token, String(process.env.JWT_KEY));
        
        if (authenticated) {
            return res.status(200).send({ authenticated, });
        } else {
            return res.status(401).send({authenticated });
        }
    }catch(err: any){
        return res.status(401).send({authenticated: false});
    }
}