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
exports.login = void 0;
const authService_1 = require("../services/authService");
const loginSchema_1 = require("../schemas/loginSchema");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = loginSchema_1.loginSchema.parse(req.body);
        const user = yield (0, authService_1.authenticateUser)(email, password);
        const token = (0, authService_1.generateToken)(user);
        res.status(200).json({
            ok: true,
            message: "User authenticated successfully.",
            data: {
                token,
            },
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
