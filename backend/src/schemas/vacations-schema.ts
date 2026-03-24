/**
 * @fileoverview Vacation request validation schemas (add, update).
 * Layer: Schema — Zod schemas for vacation CRUD; date rules differ for add vs update.
 * Notes:
 * - Add schema blocks past start dates.
 * - Update schema allows historical records editing.
 */

import { z } from "zod";

/** Base fields shared by add and update; no date-range rules. */
const baseVacationSchema = z.object({
    // Destination name (city/country/place).
    destination: z
        .string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),

    // Vacation description shown in UI.
    description: z
        .string({ message: "Description is required" })
        .trim()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(1000, { message: "Description must be at most 1000 characters long" }),

    // Start date (coerced from string payload).
    startDate: z.coerce.date({ message: "Start date is required" }),

    // End date (coerced from string payload).
    endDate: z.coerce.date({ message: "End date is required" }),

    // Price value (server accepts numeric payload and validates range).
    price: z.coerce
        .number({ message: "Price is required" })
        .min(1, { message: "Price must be greater than 0" })
        .max(10000, { message: "Price must be at most 10,000" }),
});

/** Add schema: start date cannot be in the past. */
export const addVacationSchema = baseVacationSchema
    // New vacations must not start in the past.
    .refine(data => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Start date cannot be in the past",
        path: ["startDate"],
    })
    // End date must always be strictly later than start date.
    .refine(data => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });

/** Update schema: past dates allowed (editing historical vacations). */
export const updateVacationSchema = baseVacationSchema
    // Even for updates, end date must remain after start date.
    .refine(data => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });

/** Alias for addVacationSchema (backward compatibility). */
export const vacationSchema = addVacationSchema;

export type AddVacationSchema = z.infer<typeof addVacationSchema>;
export type UpdateVacationSchema = z.infer<typeof updateVacationSchema>;
export type VacationSchema = z.infer<typeof addVacationSchema>;
