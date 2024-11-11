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
exports.retryCsvUpload = exports.uploadCsv = void 0;
const uploadService_1 = require("../services/uploadService");
const uploadCsv = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file || !req.file.buffer) {
            res.status(400).json({ message: 'No file uploaded or file is invalid.' });
            return;
        }
        const result = {
            ok: true,
            data: yield (0, uploadService_1.processCsvUpload)(req.file.buffer)
        };
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.uploadCsv = uploadCsv;
const retryCsvUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, age } = req.body;
        const result = yield (0, uploadService_1.processCsvUploadRetry)([{ name, email, age }]);
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
    }
    catch (error) {
        next(error);
    }
});
exports.retryCsvUpload = retryCsvUpload;
