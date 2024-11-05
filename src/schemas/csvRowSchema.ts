import { z } from 'zod';

export const csvRowSchema = z.object({
    name: z.string().min(1, { message: "El campo 'name' no puede estar vacío." }),
    email: z.string().email({ message: "El formato del campo 'email' es inválido." }),
    age: z.number().positive({ message: "El campo 'age' debe ser un número positivo." }),
});
