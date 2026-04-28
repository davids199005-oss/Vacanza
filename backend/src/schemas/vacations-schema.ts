

import { z } from "zod";


// Shared validation fields for creating and updating vacations.
const baseVacationSchema = z.object({
    
    destination: z
        .string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),

    
    description: z
        .string({ message: "Description is required" })
        .trim()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(1000, { message: "Description must be at most 1000 characters long" }),

    
    startDate: z.coerce.date({ message: "Start date is required" }),

    
    endDate: z.coerce.date({ message: "End date is required" }),

    
    price: z.coerce
        .number({ message: "Price is required" })
        .min(1, { message: "Price must be greater than 0" })
        .max(10000, { message: "Price must be at most 10,000" }),
});


export const addVacationSchema = baseVacationSchema
    // New vacations cannot start in the past.
    .refine(data => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Start date cannot be in the past",
        path: ["startDate"],
    })
    // End date must always be after start date.
    .refine(data => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });


export const updateVacationSchema = baseVacationSchema
    // Keep date ordering valid during updates as well.
    .refine(data => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });


export const vacationSchema = addVacationSchema;

export type AddVacationSchema = z.infer<typeof addVacationSchema>;
export type UpdateVacationSchema = z.infer<typeof updateVacationSchema>;
export type VacationSchema = z.infer<typeof addVacationSchema>;
