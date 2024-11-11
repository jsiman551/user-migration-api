"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, _res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return next({ status: 401, message: 'No token provided' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next({ status: 401, message: 'Unauthorized' });
        }
        const payload = decoded;
        //only admins must handle /upload endpoint
        if (req.path === '/upload' && payload.role !== 'admin') {
            return next({ status: 403, message: 'Admins only' });
        }
        next();
    });
};
exports.default = authMiddleware;
