/**
 * @fileoverview Auth controller: register and login endpoints.
 * Layer: Controller — validates input, delegates to authService, returns JWT.
 * Notes:
 * - Controller contains no DB logic; it only orchestrates request flow.
 * - Validation errors and domain errors are forwarded to error middleware.
 */

import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../schemas/auth-schema.ts";
import { authService } from "../services/auth-service.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";



class AuthController {
    constructor() {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    // Register a new account and return access token.
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and normalize request body.
            const data = registerSchema.parse(req.body);
            // Delegate account creation + token issuance.
            const token = await authService.register(data);
            // Return token for frontend session bootstrap.
            res.status(StatusCode.CREATED).json({ token });
        } catch (error) {
            // Delegate any failure to centralized error handler.
            next(error);
        }
    }

    // Authenticate user and return access token.
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate credentials payload.
            const data = loginSchema.parse(req.body);
            // Delegate auth verification + token issuance.
            const token = await authService.login(data);
            res.status(StatusCode.OK).json({ token });
        } catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();