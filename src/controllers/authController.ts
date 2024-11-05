import { Request, Response } from 'express';
import { authenticateUser, generateToken } from '../services/authService';

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        const token = generateToken(user);
        return res.status(200).json({ token });
    } catch (error: any) {
        if (error.message === 'Incorrect Credentials') {
            return res.status(401).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};
