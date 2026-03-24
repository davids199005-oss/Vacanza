/**
 * @fileoverview JWT decode utility for extracting user claims from access token.
 * Layer: Utils — auth token parsing; used by restoreSession and login/register flows.
 * Notes:
 * - Performs lightweight decode without signature verification (client-side).
 * - Server-side verification still happens in backend middleware.
 */

import { IUser } from "../models/User";
import { Role } from "../models/Role";

interface JwtPayload {
    // User id claim.
    id: number;
    // User email claim.
    email: string;
    // Role claim for UI guarding.
    role: Role;
    // First name claim.
    firstName: string;
    // Last name claim.
    lastName: string;
    // Expiration time (Unix seconds).
    exp: number;
}

/**
 * Decodes JWT and returns IUser. Throws if token is expired.
 * Avatar is not in JWT — fetched separately via getProfile.
 */
export function jwtDecode(token: string): IUser {
    // Decode base64 payload segment from JWT.
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;

    // exp is Unix seconds; compare with Date.now() (ms)
    if (payload.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
    }

    return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
        // Avatar is fetched from profile endpoint, not encoded in token.
        avatar: null, // Avatar fetched separately via getProfile
    };
}
