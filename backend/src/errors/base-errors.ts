/**
 * @fileoverview Custom error hierarchy for API error handling.
 * Layer: Domain — maps errors to HTTP status codes.
 * Notes:
 * - Services/controllers throw typed errors instead of raw strings.
 * - Global error middleware reads `status` to build HTTP response.
 */

import { StatusCode } from "../enums/status-codes-enum.ts";

/** Base error with HTTP status code. */
export class BaseError extends Error {
    // HTTP status associated with this domain error.
    public status: StatusCode;

    constructor(message: string, status: StatusCode) {
        // Save human-readable error message.
        super(message);
        // Preserve child class name for diagnostics.
        this.name = this.constructor.name;
        // Persist status code for middleware response mapping.
        this.status = status;

    }
}

/** 404 Not Found. */
export class NotFoundError extends BaseError {
    constructor(message: string = 'Resource not found') {
        // Default semantic mapping for missing entities.
        super(message, StatusCode.NOT_FOUND);
    }
}

/** 401 Unauthorized. */
export class UnauthorizedError extends BaseError {
    constructor(message: string = 'Unauthorized') {
        // Used for missing/invalid authentication.
        super(message, StatusCode.UNAUTHORIZED);
    }
}

/** 403 Forbidden (RBAC). */
export class ForbiddenError extends BaseError {
    constructor(message: string = 'Forbidden') {
        // Used when user is authenticated but lacks permission.
        super(message, StatusCode.FORBIDDEN);
    }
}

/** 409 Conflict (e.g. duplicate email). */
export class ConflictError extends BaseError {
    constructor(message: string = 'Conflict') {
        // Used for uniqueness/domain conflicts.
        super(message, StatusCode.CONFLICT);
    }
}

/** 400 Bad Request. */
export class BadRequestError extends BaseError {
    constructor(message: string = 'Bad Request') {
        // Used for malformed input/business precondition failures.
        super(message, StatusCode.BAD_REQUEST);
    }
}

/** 500 Internal Server Error. */
export class InternalServerError extends BaseError {
    constructor(message: string = 'Internal Server Error') {
        // Used for unrecoverable server-side failures.
        super(message, StatusCode.INTERNAL_SERVER_ERROR);
    }
}

/** 400 Bad Request with validation details. */
export class ValidationError extends BaseError {
    // Additional structured validation context.
    public details: string;
    constructor(message: string, details: string) {
        // Validation issues are client-side input problems -> 400.
        super(message, StatusCode.BAD_REQUEST);
        // Store details for API response diagnostics.
        this.details = details;
    }
}