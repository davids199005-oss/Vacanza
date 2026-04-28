

import { z } from "zod";

// Validation schema for profile updates.
export const updateProfileSchema = z.object({
    
    firstName: z
        .string({ message: "First name is required" })
        .trim()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name must be at most 50 characters long" })
        .regex(/^[a-zA-Z]+$/, { message: "First name must contain only letters" }),

    
    lastName: z
        .string({ message: "Last name is required" })
        .trim()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name must be at most 50 characters long" })
        .regex(/^[a-zA-Z]+$/, { message: "Last name must contain only letters" }),

    
    email: z.email({ message: "Invalid email address" })
        .trim()
        .toLowerCase()
        .max(254, { message: "Email must be at most 254 characters long" }),
});

// Validation schema for password change requests.
export const changePasswordSchema = z.object({
    
    currentPassword: z
        .string({ message: "Current password is required" })
        .min(8, { message: "Current password must be at least 8 characters long" }),

    
    newPassword: z
        .string({ message: "New password is required" })
        .trim()
            .min(8, { message: "Password must be at least 8 characters long" })
        .max(72, { message: "Password must be at most 72 characters long" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/,
            { message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" }
        ),

    
    confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters long" }),

// Enforce password confirmation match.
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
