

import { BaseError, ValidationError } from "../errors/base-errors.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { Request, Response, NextFunction } from "express";
import { env } from "../configs/env-validator.ts";
import { ZodError } from "zod";
import multer from "multer";
import { INVALID_IMAGE_FORMAT_ERROR } from "../utils/multer-util.ts";


export function errorHandlerMiddleware(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    
    const isDevelopment = env.NODE_ENV === "development";

    
    

    
    if (err instanceof multer.MulterError) {
        
        res.status(StatusCode.BAD_REQUEST).json({
            message: err.message,
            
            ...(isDevelopment && { details: err.message }),
        });
        return;
    }
    
    if (err instanceof Error && err.message === INVALID_IMAGE_FORMAT_ERROR) {
        
        res.status(StatusCode.BAD_REQUEST).json({
            message: err.message,
        });
        return;
    }
    
    if (err instanceof BaseError || err instanceof ZodError) {
        
        res.status(err instanceof BaseError ? err.status : StatusCode.BAD_REQUEST).json({
            
            message: err instanceof BaseError ? err.message : "Validation error",
            
            ...(isDevelopment && { stack: err.stack }),
            
            ...(err instanceof ValidationError && { details: err.details }),
            
            ...(err instanceof ZodError && { details: err.issues.map(issue => issue.message).join(", ") }),
        });
        return;
    }
    
    else {
        
        console.error("Unknown error ❌:", err);

        
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            
            ...(isDevelopment && { details: err instanceof Error ? err.message : String(err) }),
        });
    }
}
