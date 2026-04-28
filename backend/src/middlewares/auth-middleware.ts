

import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/base-errors.ts";
import { verifyToken } from "../utils/jwt-util.ts";


export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    try {
        
        const token = req.headers.authorization;
        
        if (!token || !token.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authentication required");
        }
        
        const tokenValue = token.split(" ")[1];
        
        const decoded = verifyToken(tokenValue);
        
        req.user = decoded;
        
        next();
    } catch (error) {
        
        next(error);
    }
}
