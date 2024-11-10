import { Request, Response, NextFunction } from 'express';
import { processCsvUpload, processCsvUploadRetry } from '../services/uploadService';

export const uploadCsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file || !req.file.buffer) {
            res.status(400).json({ message: 'No file uploaded or file is invalid.' });
            return;
        }

        const result = {
            ok: true,
            data: await processCsvUpload(req.file.buffer)
        }
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

export const retryCsvUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, age } = req.body;

        const result = await processCsvUploadRetry([{ name, email, age }]);

        //optional
        if (result.errors.length > 0) {
            res.status(400).json({
                ok: false,
                errors: result.errors,
            });
            return;
        }

        res.status(200).json({
            ok: true,
            data: result.success,
        });

    } catch (error) {
        next(error);
    }
};
