import { Request, Response, NextFunction } from 'express';
import { processCsvUpload } from '../services/uploadService';

export const uploadCsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file || !req.file.buffer) {
            res.status(400).json({ message: 'No file uploaded or file is invalid.' });
            return;
        }

        const result = await processCsvUpload(req.file.buffer);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
