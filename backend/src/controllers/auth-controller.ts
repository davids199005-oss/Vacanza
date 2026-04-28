

import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../schemas/auth-schema.ts";
import { authService } from "../services/auth-service.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";



class AuthController {
    constructor() {
        
        
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const data = registerSchema.parse(req.body);
            
            const token = await authService.register(data);
            
            res.status(StatusCode.CREATED).json({ token });
        } catch (error) {
            
            next(error);
        }
    }

    
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const data = loginSchema.parse(req.body);
            
            const token = await authService.login(data);
            res.status(StatusCode.OK).json({ token });
        } catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();
