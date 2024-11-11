"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvRowSchema = void 0;
const zod_1 = require("zod");
exports.csvRowSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "'name' is required" }),
    email: zod_1.z.string().email({ message: "'email' must be a valid format" }),
    age: zod_1.z.number().positive({ message: "'age' must be a positive number" }),
});
