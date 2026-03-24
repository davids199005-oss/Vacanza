/**
 * @fileoverview JWT payload model for decoded access tokens.
 * Layer: Domain — defines the shape of authenticated user data in tokens.
 * Notes:
 * - This payload is signed into JWT on login/register.
 * - The same shape is attached to `req.user` after token verification.
 */

import { Role } from "../enums/roles-enum.ts";

/** Payload embedded in JWT; attached to req.user after auth middleware. */
export interface JwtPayload {
    // Authenticated user id.
    id: number;
    // Authenticated user email.
    email: string;
    // Authenticated user role (for RBAC).
    role: Role;
    // First name used by client UI/profile.
    firstName: string;
    // Last name used by client UI/profile.
    lastName: string;
    
}