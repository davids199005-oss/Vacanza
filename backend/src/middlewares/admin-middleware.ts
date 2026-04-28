

import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/base-errors.ts";
import { Role } from "../enums/roles-enum.ts";


export function adminMiddleware(req: Request, _res: Response, next: NextFunction): void {
    try {
        
        if (!req.user) {
            throw new UnauthorizedError("Authentication required");
        }

        
        if (req.user.role !== Role.ADMIN) {
            throw new ForbiddenError("Access denied");
        }

        
        next();
    } catch (error) {
        
        next(error);
    }
}
