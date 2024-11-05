import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!secretKey) {
        return res.status(500).json({ message: 'Secret JWT is not set' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email not found in records' });
        }

        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong Password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', error });
    }
};
