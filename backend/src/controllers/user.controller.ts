import bcrypt from 'bcrypt';
import { createUser } from "../repositories/user.repository";
import { createUserValidation } from "../validations/user.validation";
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
    try {
        await createUserValidation.validate(req.body);
        
        const hashPass = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashPass;

        const user = await createUser(req.body);
        
        res.status(200).send(user);
        
    } catch (error: any) {
        res.status(500).send({error: error.errors});

    }
}