/**
 * @fileoverview HTTP status codes used across the API.
 * Layer: Domain — centralizes status code constants.
 * Notes:
 * - Avoids magic numbers in controllers/middlewares.
 */

export enum StatusCode {
    // Standard success.
    OK = 200,
    // Resource created successfully.
    CREATED = 201,
    // Success with empty response body.
    NO_CONTENT = 204,
    // Invalid client request.
    BAD_REQUEST = 400,
    // Missing/invalid authentication.
    UNAUTHORIZED = 401,
    // Authenticated but not allowed.
    FORBIDDEN = 403,
    // Resource not found.
    NOT_FOUND = 404,
    // Data conflict (e.g., duplicate unique key).
    CONFLICT = 409,
    // Unexpected server failure.
    INTERNAL_SERVER_ERROR = 500,
}