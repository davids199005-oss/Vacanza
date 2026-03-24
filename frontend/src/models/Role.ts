/**
 * @fileoverview Role constants and type for RBAC.
 * Layer: Domain — user role definitions used for authorization.
 * Notes:
 * - Keep values in sync with backend `roles-enum.ts`.
 */

export const Role: Record<string, string> = {
    // Regular user role.
    USER: "user",
    // Administrator role.
    ADMIN: "admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];