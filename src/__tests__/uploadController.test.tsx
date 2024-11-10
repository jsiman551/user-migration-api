import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { uploadCsv, retryCsvUpload } from '../../src/controllers/uploadController';
import { processCsvUpload, processCsvUploadRetry } from '../../src/services/uploadService';

vi.mock('../../src/services/uploadService');

describe('uploadController', () => {
    const mockRequest = {} as Request;
    const mockResponse = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as unknown as Response;
    const mockNext = vi.fn() as NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('uploadCsv', () => {
        it('should return 400 if no file is uploaded', async () => {
            mockRequest.file = undefined;

            await uploadCsv(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No file uploaded or file is invalid.' });
        });

        it('should process and upload CSV file successfully', async () => {
            const mockData = { success: [{ name: 'John Doe', email: 'john@example.com', age: 30 }] };
            (processCsvUpload as vi.Mock).mockResolvedValue(mockData);

            mockRequest.file = { buffer: Buffer.from('mock csv content') } as Express.Multer.File;

            await uploadCsv(mockRequest, mockResponse, mockNext);

            expect(processCsvUpload).toHaveBeenCalledWith(mockRequest.file.buffer);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: true,
                data: mockData,
            });
        });

        it('should call next with an error if upload fails', async () => {
            const mockError = new Error('upload error');
            (processCsvUpload as vi.Mock).mockRejectedValue(mockError);

            mockRequest.file = { buffer: Buffer.from('mock csv content') } as Express.Multer.File;

            await uploadCsv(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe('retryCsvUpload', () => {
        it('should return 400 if there are validation errors in retry', async () => {
            const mockError = { errors: [{ message: 'Invalid email format', field: 'email' }] };
            (processCsvUploadRetry as vi.Mock).mockResolvedValue(mockError);

            mockRequest.body = { name: 'John Doe', email: 'invalid-email', age: '30' };

            await retryCsvUpload(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                errors: mockError.errors,
            });
        });

        it('should call next with an error if retry fails', async () => {
            const mockError = new Error('retry error');
            (processCsvUploadRetry as vi.Mock).mockRejectedValue(mockError);

            mockRequest.body = { name: 'John Doe', email: 'john@example.com', age: '30' };

            await retryCsvUpload(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});
