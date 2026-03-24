/**
 * @fileoverview Zod schemas for login and registration forms.
 * Layer: Validation — auth form validation.
 * Notes:
 * - Mirrors backend auth validation rules for immediate client feedback.
 */

import { z } from "zod";

const nameRegex = /^[a-zA-Z]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
    // First name with basic character/length constraints.
    firstName: z
        .string({ message: "First name is required" })
        .trim()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name must be at most 50 characters long" })
        .regex(nameRegex, { message: "First name must contain only letters" }),

    // Last name with basic character/length constraints.
    lastName: z
        .string({ message: "Last name is required" })
        .trim()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name must be at most 50 characters long" })
        .regex(nameRegex, { message: "Last name must contain only letters" }),

    // Normalized email value.
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase()
        .max(254, { message: "Email must be at most 254 characters long" }),

    // Strong password policy for account creation.
    password: z
        .string({ message: "Password is required" })
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(72, { message: "Password must be at most 72 characters long" })
        .regex(passwordRegex, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" }),
});

export const loginSchema = z.object({
    // Email credential.
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase(),

    // Password credential.
    password: z
        .string({ message: "Password is required" })
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(72, { message: "Password must be at most 72 characters long" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
