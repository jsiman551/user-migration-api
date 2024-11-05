import jwt from 'jsonwebtoken';
import User from '../models/user';

const secretKey = process.env.JWT_SECRET;

// Verify user credentials
export const authenticateUser = async (email: string, password: string): Promise<User> => {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.verifyPassword(password))) {
        throw new Error('Incorrect Credentials');
    }
    return user;
};

// Generate a token
export const generateToken = (user: User): string => {
    if (!secretKey) {
        throw new Error('JWT secret is not set');
    }
    return jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
};
