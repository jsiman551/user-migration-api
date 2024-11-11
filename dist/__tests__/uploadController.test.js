"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const uploadController_1 = require("../../src/controllers/uploadController");
const uploadService_1 = require("../../src/services/uploadService");
vitest_1.vi.mock('../../src/services/uploadService');
(0, vitest_1.describe)('uploadController', () => {
    const mockRequest = {};
    const mockResponse = {
        status: vitest_1.vi.fn().mockReturnThis(),
        json: vitest_1.vi.fn(),
    };
    const mockNext = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('uploadCsv', () => {
        (0, vitest_1.it)('should return 400 if no file is uploaded', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.file = undefined;
            yield (0, uploadController_1.uploadCsv)(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(mockResponse.json).toHaveBeenCalledWith({ message: 'No file uploaded or file is invalid.' });
        }));
        (0, vitest_1.it)('should process and upload CSV file successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = { success: [{ name: 'John Doe', email: 'john@example.com', age: 30 }] };
            uploadService_1.processCsvUpload.mockResolvedValue(mockData);
            mockRequest.file = { buffer: Buffer.from('mock csv content') };
            yield (0, uploadController_1.uploadCsv)(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(uploadService_1.processCsvUpload).toHaveBeenCalledWith(mockRequest.file.buffer);
            (0, vitest_1.expect)(mockResponse.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(mockResponse.json).toHaveBeenCalledWith({
                ok: true,
                data: mockData,
            });
        }));
        (0, vitest_1.it)('should call next with an error if upload fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('upload error');
            uploadService_1.processCsvUpload.mockRejectedValue(mockError);
            mockRequest.file = { buffer: Buffer.from('mock csv content') };
            yield (0, uploadController_1.uploadCsv)(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(mockError);
        }));
    });
    (0, vitest_1.describe)('retryCsvUpload', () => {
        (0, vitest_1.it)('should return 400 if there are validation errors in retry', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = { errors: [{ message: 'Invalid email format', field: 'email' }] };
            uploadService_1.processCsvUploadRetry.mockResolvedValue(mockError);
            mockRequest.body = { name: 'John Doe', email: 'invalid-email', age: '30' };
            yield (0, uploadController_1.retryCsvUpload)(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                errors: mockError.errors,
            });
        }));
        (0, vitest_1.it)('should call next with an error if retry fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('retry error');
            uploadService_1.processCsvUploadRetry.mockRejectedValue(mockError);
            mockRequest.body = { name: 'John Doe', email: 'john@example.com', age: '30' };
            yield (0, uploadController_1.retryCsvUpload)(mockRequest, mockResponse, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(mockError);
        }));
    });
});
