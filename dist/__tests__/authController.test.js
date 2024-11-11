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
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const authService_1 = require("../services/authService");
vitest_1.vi.mock('../services/authService', () => ({
    authenticateUser: vitest_1.vi.fn(),
    generateToken: vitest_1.vi.fn(),
}));
(0, vitest_1.describe)('POST /login', () => {
    (0, vitest_1.it)('should authenticate user and return a token when credentials are correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = { id: '1', role: 'user' };
        const mockToken = 'mocked-jwt-token';
        authService_1.authenticateUser.mockResolvedValue(mockUser);
        authService_1.generateToken.mockReturnValue(mockToken);
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({ email: 'user@example.com', password: 'password123' });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.ok).toBe(true);
        (0, vitest_1.expect)(response.body.message).toBe('User authenticated successfully.');
        (0, vitest_1.expect)(response.body.data.token).toBe(mockToken);
        (0, vitest_1.expect)(authService_1.generateToken).toHaveBeenCalledWith(mockUser);
    }));
    (0, vitest_1.it)('should return an error when credentials are incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        authService_1.authenticateUser.mockRejectedValue(new Error('Incorrect Credentials'));
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({ email: 'user@example.com', password: 'wrongpassword' });
        (0, vitest_1.expect)(response.status).toBe(500);
        (0, vitest_1.expect)(response.body.title).toBe('Incorrect Credentials');
        (0, vitest_1.expect)(response.body.status).toBe(500);
        (0, vitest_1.expect)(response.body.type).toBe('https://example.com/probs/server-error');
    }));
    (0, vitest_1.it)('should return a validation error if the request body is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidBody = { email: 'user@example.com' };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send(invalidBody);
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.errors).toBeDefined();
        (0, vitest_1.expect)(response.body.errors[0].detail).toBe('Required');
    }));
});
