/**
 * @fileoverview Zod schemas for vacation create/edit forms.
 * Layer: Validation — vacation form validation with date constraints.
 * Notes:
 * - Add schema blocks past start dates.
 * - Update schema keeps only relative date ordering rule.
 */

import { z } from "zod";

const baseVacationSchema = z.object({
    // Destination input field.
    destination: z
        .string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),

    // Description input field.
    description: z
        .string({ message: "Description is required" })
        .trim()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(1000, { message: "Description must be at most 1000 characters long" }),

    // Start date string from date picker.
    startDate: z.string({ message: "Start date is required" }).min(1, { message: "Start date is required" }),

    // End date string from date picker.
    endDate: z.string({ message: "End date is required" }).min(1, { message: "End date is required" }),

    // Numeric price field.
    price: z.coerce
        .number({ message: "Price is required" })
        .min(1, { message: "Price must be greater than 0" })
        .max(10000, { message: "Price must be at most 10,000" }),
});

export const addVacationSchema = baseVacationSchema
    // New vacations must not start in the past.
    .refine(data => new Date(data.startDate) >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Start date cannot be in the past",
        path: ["startDate"],
    })
    // End date must be later than start date.
    .refine(data => new Date(data.endDate) > new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export const updateVacationSchema = baseVacationSchema
    // End date must be later than start date.
    .refine(data => new Date(data.endDate) > new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export type AddVacationFormData = z.infer<typeof addVacationSchema>;
export type UpdateVacationFormData = z.infer<typeof updateVacationSchema>;
