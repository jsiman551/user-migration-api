import User, { UserCreationAttributes } from '../models/user';
import { ZodError } from 'zod';
import { csvRowSchema } from '../schemas/csvRowSchema';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

interface CsvUploadResult {
    success: any[];
    errors: any[];
}

export const processCsvUpload = async (fileBuffer: Buffer): Promise<CsvUploadResult> => {
    const results: any[] = [];
    const errors: any[] = [];

    return new Promise((resolve, reject) => {
        const stream = Readable.from(fileBuffer.toString());
        const csvResults: any[] = [];

        stream
            .pipe(csvParser())
            .on('data', async (row) => {
                const { name, email, age } = row;

                try {
                    const validatedData = csvRowSchema.parse({ name, email, age: parseInt(age) });

                    const userData: UserCreationAttributes = {
                        ...validatedData,
                        role: 'user',
                        password: '123456',
                    };

                    // Create the user
                    const newUser = await User.create(userData);
                    results.push(newUser);
                } catch (error) {
                    if (error instanceof ZodError) {
                        errors.push({
                            row: csvResults.length + 1,
                            details: error.errors.map((e) => e.message).join(', '),
                        });
                    } else if (error instanceof Error) {
                        errors.push({
                            row: csvResults.length + 1,
                            details: error.message || 'Error creating user',
                        });
                    } else {
                        errors.push({
                            row: csvResults.length + 1,
                            details: 'An unknown error occurred',
                        });
                    }
                }

                csvResults.push(row);
            })
            .on('end', () => {
                resolve({
                    success: results,
                    errors: errors,
                });
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};
