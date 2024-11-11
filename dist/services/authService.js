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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const secretKey = process.env.JWT_SECRET;
// Verify user credentials
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ where: { email } });
    if (!user || !(yield user.verifyPassword(password))) {
        throw new Error('Incorrect Credentials');
    }
    return user;
});
exports.authenticateUser = authenticateUser;
// Generate a token
const generateToken = (user) => {
    if (!secretKey) {
        throw new Error('JWT secret is not set');
    }
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
