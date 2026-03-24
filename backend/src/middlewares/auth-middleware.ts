/**
 * @fileoverview JWT authentication middleware.
 * Layer: Middleware — validates Bearer token and attaches req.user.
 * Notes:
 * - Reads `Authorization` header from incoming request.
 * - Expects strict format: `Bearer <jwt>`.
 * - Verifies signature and payload via shared JWT utility.
 * - Stores decoded payload in `req.user` for downstream handlers.
 * - For any error, delegates to global error handler with `next(error)`.
 */

import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/base-errors.ts";
import { verifyToken } from "../utils/jwt-util.ts";

/** Extracts Bearer token, verifies JWT, sets req.user; throws UnauthorizedError on failure. */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    try {
        // Read raw Authorization header value.
        const token = req.headers.authorization;
        // Reject missing header or invalid schema before token parsing.
        if (!token || !token.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authentication required");
        }
        // Header format is "Bearer <token>", so index 1 is actual JWT string.
        const tokenValue = token.split(" ")[1];
        // Validate token integrity and decode payload (id, email, role, etc.).
        const decoded = verifyToken(tokenValue);
        // Persist user context on request for controller/service authorization logic.
        req.user = decoded;
        // Continue request pipeline.
        next();
    } catch (error) {
        // Forward auth failures (expired/invalid token) to centralized handler.
        next(error);
    }
}
