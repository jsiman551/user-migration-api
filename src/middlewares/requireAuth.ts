import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
    role: string;
}

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next({ status: 401, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return next({ status: 401, message: 'Unauthorized' });
        }

        const payload = decoded as JwtPayload;

        //only admins must handle /upload endpoint
        if (req.path === '/upload' && payload.role !== 'admin') {
            return next({ status: 403, message: 'Admins only' });
        }

        next();
    });
};

export default authMiddleware;
