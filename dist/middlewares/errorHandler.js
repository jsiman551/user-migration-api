"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
//This handler follows RFC 7807 standard
const errorHandler = (err, _req, res, _next) => {
    // if it is about Zod validation
    if (err instanceof zod_1.ZodError) {
        const errors = err.errors.map((error) => ({
            status: 400,
            title: "Validation Error",
            detail: error.message,
            source: { pointer: error.path.join('/') },
        }));
        return res.status(400).json({
            type: "https://example.com/probs/validation",
            title: "Validation Failed",
            status: 400,
            errors,
        });
    }
    // others errors
    return res.status(err.status || 500).json({
        type: "https://example.com/probs/server-error",
        title: err.message || "Server Error",
        status: err.status || 500,
        detail: err.detail || "An unexpected error occurred",
    });
};
exports.errorHandler = errorHandler;
