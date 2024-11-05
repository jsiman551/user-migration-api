import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

//This handler follows RFC 7807 standard
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    // if it is about Zod validation
    if (err instanceof ZodError) {
        const errors = err.errors.map((error) => ({
            status: 400,
            title: "Validation Error",
            detail: error.message,
            source: { pointer: error.path.join('/') },
        }));

        return res.status(400).json({
            type: "https://example.com/probs/validation",
            title: "Validation Failed",
            status: 400,
            errors,
        });
    }

    // others errors
    return res.status(err.status || 500).json({
        type: "https://example.com/probs/server-error",
        title: err.message || "Server Error",
        status: err.status || 500,
        detail: err.detail || "An unexpected error occurred",
    });
};
