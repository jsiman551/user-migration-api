import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import { authenticateUser, generateToken } from '../services/authService';

vi.mock('../services/authService', () => ({
    authenticateUser: vi.fn(),
    generateToken: vi.fn(),
}));

describe('POST /login', () => {
    it('should authenticate user and return a token when credentials are correct', async () => {
        const mockUser = { id: '1', role: 'user' };
        const mockToken = 'mocked-jwt-token';

        (authenticateUser as vi.Mock).mockResolvedValue(mockUser);
        (generateToken as vi.Mock).mockReturnValue(mockToken);

        const response = await request(app)
            .post('/login')
            .send({ email: 'user@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe('User authenticated successfully.');
        expect(response.body.data.token).toBe(mockToken);
        expect(generateToken).toHaveBeenCalledWith(mockUser);
    });

    it('should return an error when credentials are incorrect', async () => {
        (authenticateUser as vi.Mock).mockRejectedValue(new Error('Incorrect Credentials'));

        const response = await request(app)
            .post('/login')
            .send({ email: 'user@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(500);
        expect(response.body.title).toBe('Incorrect Credentials');
        expect(response.body.status).toBe(500);
        expect(response.body.type).toBe('https://example.com/probs/server-error');
    });

    it('should return a validation error if the request body is invalid', async () => {
        const invalidBody = { email: 'user@example.com' };

        const response = await request(app)
            .post('/login')
            .send(invalidBody);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].detail).toBe('Required');
    });
});
