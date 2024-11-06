import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processCsvUpload } from '../services/uploadService';
import User from '../models/user';

describe('processCsvUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería procesar correctamente un CSV con datos válidos', async () => {
        // define a valid CVS file as buffer
        const validCsvBuffer = Buffer.from(
            `name,email,age\nJohn Doe,john@example.com,30\nJane Smith,jane@example.com,25`
        );

        // Simulation of successful user creation
        vi.spyOn(User, 'create').mockImplementation((userData) => {
            return Promise.resolve({
                ...userData,
                id: Math.floor(Math.random() * 1000),
                password: 'hashedpassword',
                toJSON() {
                    return this;
                },
            }) as any;
        });

        const result = await processCsvUpload(validCsvBuffer);

        console.log(result)

        expect(result.success).toHaveLength(2);
        expect(result.errors).toHaveLength(0);
        expect(User.create).toHaveBeenCalledTimes(2);
    });

    it('debería retornar errores cuando el CSV tiene datos inválidos', async () => {
        const invalidCsvBuffer = Buffer.from(
            `name,email,age\nJohn Doe,invalid-email,30\n,missing@domain.com,abc\n`
        );

        const result = await processCsvUpload(invalidCsvBuffer);

        expect(result.success).toHaveLength(0);
        expect(result.errors).toHaveLength(2);
        expect(result.errors[0]).toMatchObject({
            row: 1,
            title: "'email' must be a valid format",
            source: { pointer: 'email' }
        });
        expect(result.errors[1]).toMatchObject({
            row: 2,
            title: "'name' is required, Expected number, received nan",
            source: { pointer: 'name' }
        });
    });
});
