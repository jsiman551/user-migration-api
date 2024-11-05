import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next({ status: 401, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
        if (err) {
            return next({ status: 401, message: 'Unauthorized' });
        }
        next();
    });
};

export default authMiddleware;
