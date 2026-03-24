/**
 * @fileoverview User domain models.
 * Layer: Domain — interfaces for user entities (with/without password).
 * Notes:
 * - `IUser` represents internal canonical user shape from service/DB layers.
 * - `User` removes sensitive password for API-safe transfer objects.
 */

import { Role } from "../enums/roles-enum.ts";

/** Full user including hashed password (DB/internal use). */
export interface IUser {
    // Database primary key.
    id: number;
    // User first name.
    firstName: string;
    // User last name.
    lastName: string;
    // Unique user email (login identifier).
    email: string;
    // Password hash (never plaintext).
    password: string;
    // Authorization role used by RBAC checks.
    role: Role;
    // Optional avatar filename stored on disk.
    avatar: string | null;

}

/** User without password (safe for API responses). */
export type User = Omit<IUser, 'password'>;