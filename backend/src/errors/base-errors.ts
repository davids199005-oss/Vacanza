

import { StatusCode } from "../enums/status-codes-enum.ts";


export class BaseError extends Error {
    
    public status: StatusCode;

    constructor(message: string, status: StatusCode) {
        
        super(message);
        
        this.name = this.constructor.name;
        
        this.status = status;

    }
}


export class NotFoundError extends BaseError {
    constructor(message: string = 'Resource not found') {
        
        super(message, StatusCode.NOT_FOUND);
    }
}


export class UnauthorizedError extends BaseError {
    constructor(message: string = 'Unauthorized') {
        
        super(message, StatusCode.UNAUTHORIZED);
    }
}


export class ForbiddenError extends BaseError {
    constructor(message: string = 'Forbidden') {
        
        super(message, StatusCode.FORBIDDEN);
    }
}


export class ConflictError extends BaseError {
    constructor(message: string = 'Conflict') {
        
        super(message, StatusCode.CONFLICT);
    }
}


export class BadRequestError extends BaseError {
    constructor(message: string = 'Bad Request') {
        
        super(message, StatusCode.BAD_REQUEST);
    }
}


export class InternalServerError extends BaseError {
    constructor(message: string = 'Internal Server Error') {
        
        super(message, StatusCode.INTERNAL_SERVER_ERROR);
    }
}


export class ValidationError extends BaseError {
    
    public details: string;
    constructor(message: string, details: string) {
        
        super(message, StatusCode.BAD_REQUEST);
        
        this.details = details;
    }
}
