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
    const promises: Promise<void>[] = [];

    return new Promise((resolve, reject) => {
        const stream = Readable.from(fileBuffer.toString());
        const csvResults: any[] = [];

        stream
            .pipe(csvParser())
            .on('data', (row) => {
                const { name, email, age } = row;

                const userCreationPromise = (async () => {
                    try {
                        // zod validations
                        const validatedData = csvRowSchema.parse({
                            name,
                            email,
                            age: parseInt(age),
                        });

                        const userData: UserCreationAttributes = {
                            ...validatedData,
                            role: 'user',
                            password: '123456',
                        };

                        const newUser = await User.create(userData);

                        const { password, ...userWithoutSensitiveData } = newUser.toJSON();

                        results.push(userWithoutSensitiveData);

                    } catch (error) {
                        if (error instanceof ZodError) {
                            errors.push({
                                row: csvResults.length + 1,
                                name,
                                email,
                                age,
                                title: error.errors.map((e) => e.message).join(', '),
                                source: { pointer: error.errors[0].path[0] },
                            });
                        } else if (error instanceof Error) {
                            errors.push({
                                //row: csvResults.length + 1,
                                title: error.message,
                                details: error.name === 'SequelizeUniqueConstraintError' ? `${email} is already registered` : 'Error creating user',
                            });
                        } else {
                            errors.push({
                                row: csvResults.length + 1,
                                title: 'An unknown error occurred',
                            });
                        }
                    }
                })();

                promises.push(userCreationPromise);
                csvResults.push(row);
            })
            .on('end', async () => {
                try {
                    await Promise.all(promises);

                    resolve({
                        success: results,
                        errors: errors,
                    });
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

export const processCsvUploadRetry = async (retryData: Array<{ name: string; email: string; age: string }>) => {
    try {
        const userData = retryData[0];

        csvRowSchema.parse(userData);

        const newUser = await User.create({
            name: userData.name,
            email: userData.email,
            age: parseInt(userData.age, 10),
            password: '123456',
            role: 'user',
        });

        return {
            success: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                age: newUser.age,
                role: newUser.role,
            },
            errors: [],
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                errors: error.errors.map(err => err.message),
            };
        }

        throw new Error('Error processing user registration: ' + error);
    }
};
