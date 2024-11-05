import { NextFunction, Request, Response } from 'express';
import { generateToken, authenticateUser } from '../services/authService';
import { loginSchema } from '../schemas/loginSchema';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await authenticateUser(email, password);
        const token = generateToken(user);
        res.status(200).json({ token });
        return;

    } catch (error) {
        next(error);
    }
};
