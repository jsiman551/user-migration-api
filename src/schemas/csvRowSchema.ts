import { z } from 'zod';

export const csvRowSchema = z.object({
    name: z.string().min(1, { message: "'name' is required" }),
    email: z.string().email({ message: "'email' must be a valid format" }),
    age: z.number().positive({ message: "'age' must be a positive number" }),
});
