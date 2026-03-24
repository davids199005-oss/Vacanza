/**
 * @fileoverview Global error handler middleware.
 * Layer: Middleware — maps errors to HTTP responses; BaseError, ZodError, Multer.
 * Notes:
 * - Normalizes different error sources to a stable JSON contract.
 * - Includes debug details only in development mode.
 * - Prioritizes specific handlers (Multer/Zod/BaseError) before unknown fallback.
 */

import { BaseError, ValidationError } from "../errors/base-errors.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { Request, Response, NextFunction } from "express";
import { env } from "../configs/env-validator.ts";
import { ZodError } from "zod";
import multer from "multer";
import { INVALID_IMAGE_FORMAT_ERROR } from "../utils/multer-util.ts";

/** Handles BaseError, ZodError, MulterError, and unknown errors; returns JSON. */
export function errorHandlerMiddleware(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Toggle verbose diagnostics only for local/debug environments.
    const isDevelopment = env.NODE_ENV === "development";

    // Multer upload errors (e.g. file too large)
    if (err instanceof multer.MulterError) {
        // Return client-safe upload failure response.
        res.status(StatusCode.BAD_REQUEST).json({
            message: err.message,
            // Attach extra details only for debugging.
            ...(isDevelopment && { details: err.message }),
        });
        return;
    }
    // Multer file filter rejects invalid image formats
    if (err instanceof Error && err.message === INVALID_IMAGE_FORMAT_ERROR) {
        // Keep response minimal and explicit for invalid file type.
        res.status(StatusCode.BAD_REQUEST).json({
            message: err.message,
        });
        return;
    }
    // BaseError or Zod validation error
    if (err instanceof BaseError || err instanceof ZodError) {
        // Use domain status for BaseError; validation defaults to 400.
        res.status(err instanceof BaseError ? err.status : StatusCode.BAD_REQUEST).json({
            // Use domain message when available; otherwise generic validation label.
            message: err instanceof BaseError ? err.message : "Validation error",
            // Stack is useful in dev and should not leak in production.
            ...(isDevelopment && { stack: err.stack }),
            // Custom validation details from domain ValidationError.
            ...(err instanceof ValidationError && { details: err.details }),
            // Zod issues transformed into compact comma-separated details.
            ...(err instanceof ZodError && { details: err.issues.map(issue => issue.message).join(", ") }),
        });
        return;
    }
    // Unknown error: 500
    else {
        // Log full unknown error for server-side diagnostics.
        console.error("Unknown error ❌:", err);

        // Return generic message to avoid leaking internals.
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            // Optional dev-only detail for faster local debugging.
            ...(isDevelopment && { details: err instanceof Error ? err.message : String(err) }),
        });
    }
}