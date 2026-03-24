/**
 * @fileoverview Auth request validation schemas (register, login).
 * Layer: Schema — Zod schemas for auth endpoints.
 * Notes:
 * - Strings are normalized with `trim()` and email lowercasing.
 * - Password rules enforce stronger credentials at API boundary.
 */

import { z } from "zod";

export const registerSchema = z.object({
    // User first name used for profile and token payload.
    firstName: z
    .string({ message: "First name is required" })
    .trim()
    .min(2 , { message: "First name must be at least 2 characters long" })
    .max(50 , { message: "First name must be at most 50 characters long" })
    .regex(/^[a-zA-Z]+$/, { message: "First name must contain only letters" }),
    // User last name used for profile and token payload.
    lastName: z
    .string({ message: "Last name is required" })
    .trim()
    .min(2 , { message: "Last name must be at least 2 characters long" })
    .max(50 , { message: "Last name must be at most 50 characters long" })
    .regex(/^[a-zA-Z]+$/, { message: "Last name must contain only letters" }),
    // Login identifier (normalized to lowercase).
    email: z.email({ message: "Invalid email address" })
    .trim()
    .toLowerCase()
    .max(254 , { message: "Email must be at most 254 characters long" }),
    // Password complexity policy (length + upper/lower/number/special).
    password: z
    .string({ message: "Password is required" })
    .trim()
    .min(8 , { message: "Password must be at least 8 characters long" })
    .max(72 , { message: "Password must be at most 72 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" }),

});

export const loginSchema = z.object({
    // Email for credential lookup.
    email: z.email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
    // Password for bcrypt comparison.
    password: z
    .string({ message: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(72, { message: "Password must be at most 72 characters long" })
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;