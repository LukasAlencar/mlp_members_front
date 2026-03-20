import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({message: 'Token não informado'});
    }


    try {
        const _token = token.replace('Bearer ', '');
        jwt.verify(_token, String(process.env.JWT_KEY));
        next();
    }catch(err: any){
        return res.status(401).json({message: 'Token inválido'});
    }

}

export default authorize;