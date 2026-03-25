/**
 * @fileoverview User and auth-related domain models.
 * Layer: Domain — shared types for user, auth, and profile operations.
 * Notes:
 * - These types are reused by API modules, Redux, and forms.
 */

import { Role } from "./role";

export interface IUser {
    // User primary identifier.
    id: number;
    // Profile first name.
    firstName: string;
    // Profile last name.
    lastName: string;
    // Login email.
    email: string;
    // Authorization role.
    role: Role;
    // Avatar filename or null when absent.
    avatar: string | null;
}

export interface LoginData {
    // Email credential.
    email: string;
    // Password credential.
    password: string;
}

export interface RegisterData {
    // New account first name.
    firstName: string;
    // New account last name.
    lastName: string;
    // New account email.
    email: string;
    // New account password.
    password: string;
}

export interface AuthResponse {
    // Access token returned by backend.
    token: string;
}

export interface UpdateProfileData {
    // Updated first name.
    firstName: string;
    // Updated last name.
    lastName: string;
    // Updated email.
    email: string;
}

export interface ChangePasswordData {
    // Current password for verification.
    currentPassword: string;
    // New password candidate.
    newPassword: string;
    // Confirmation of new password.
    confirmPassword: string;
}
