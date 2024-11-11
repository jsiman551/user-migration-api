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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCsvUploadRetry = exports.processCsvUpload = void 0;
const user_1 = __importDefault(require("../models/user"));
const zod_1 = require("zod");
const csvRowSchema_1 = require("../schemas/csvRowSchema");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const processCsvUpload = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    const errors = [];
    const promises = [];
    return new Promise((resolve, reject) => {
        const stream = stream_1.Readable.from(fileBuffer.toString());
        const csvResults = [];
        stream
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            const { name, email, age } = row;
            const userCreationPromise = (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    // zod validations
                    const validatedData = csvRowSchema_1.csvRowSchema.parse({
                        name,
                        email,
                        age: parseInt(age),
                    });
                    const userData = Object.assign(Object.assign({}, validatedData), { role: 'user', password: '123456' });
                    const newUser = yield user_1.default.create(userData);
                    const _a = newUser.toJSON(), { password } = _a, userWithoutSensitiveData = __rest(_a, ["password"]);
                    results.push(userWithoutSensitiveData);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        errors.push({
                            row: csvResults.length + 1,
                            name,
                            email,
                            age,
                            title: error.errors.map((e) => e.message).join(', '),
                            source: { pointer: error.errors[0].path[0] },
                        });
                    }
                    else if (error instanceof Error) {
                        errors.push({
                            //row: csvResults.length + 1,
                            title: error.message,
                            details: error.name === 'SequelizeUniqueConstraintError' ? `${email} is already registered` : 'Error creating user',
                        });
                    }
                    else {
                        errors.push({
                            row: csvResults.length + 1,
                            title: 'An unknown error occurred',
                        });
                    }
                }
            }))();
            promises.push(userCreationPromise);
            csvResults.push(row);
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield Promise.all(promises);
                resolve({
                    success: results,
                    errors: errors,
                });
            }
            catch (err) {
                reject(err);
            }
        }))
            .on('error', (err) => {
            reject(err);
        });
    });
});
exports.processCsvUpload = processCsvUpload;
const processCsvUploadRetry = (retryData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = retryData[0];
        csvRowSchema_1.csvRowSchema.parse(userData);
        const newUser = yield user_1.default.create({
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
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return {
                errors: error.errors.map(err => err.message),
            };
        }
        throw new Error('Error processing user registration: ' + error);
    }
});
exports.processCsvUploadRetry = processCsvUploadRetry;
