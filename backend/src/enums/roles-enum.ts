/**
 * @fileoverview User role enum for RBAC.
 * Layer: Domain — defines authorization levels.
 * Notes:
 * - Keep values synchronized with DB role values.
 */

export enum Role {
    // Regular authenticated user.
    USER = 'user',
    // Privileged administrator.
    ADMIN = 'admin',
}