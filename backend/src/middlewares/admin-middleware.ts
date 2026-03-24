/**
 * @fileoverview Admin-only middleware (RBAC).
 * Layer: Middleware — requires req.user and Role.ADMIN; otherwise 401/403.
 * Notes:
 * - Requires auth middleware to run first (so `req.user` exists).
 * - Distinguishes auth failures (401) from permission failures (403).
 */

import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/base-errors.ts";
import { Role } from "../enums/roles-enum.ts";

/** Ensures user is authenticated and has admin role. */
export function adminMiddleware(req: Request, _res: Response, next: NextFunction): void {
    try {
        // No decoded token on request -> unauthenticated.
        if (!req.user) {
            throw new UnauthorizedError("Authentication required");
        }

        // Authenticated but not admin -> forbidden.
        if (req.user.role !== Role.ADMIN) {
            throw new ForbiddenError("Access denied");
        }

        // Access granted, continue request chain.
        next();
    } catch (error) {
        // Forward error to global error middleware.
        next(error);
    }
}