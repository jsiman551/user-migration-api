import { Request, Response } from 'express';
import { generateToken, authenticateUser } from '../services/authService';
import { z } from 'zod';
import { loginSchema } from '../schemas/loginSchema';

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await authenticateUser(email, password);
        const token = generateToken(user);
        return res.status(200).json({ token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors = error.errors.map(err => err.message);
            return res.status(400).json({ message: "Validation failed", errors: validationErrors });
        }

        console.error(error);
        return res.status(500).json({ message: 'Server Error', error });
    }
};
