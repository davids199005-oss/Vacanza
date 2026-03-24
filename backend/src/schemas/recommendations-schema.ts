/**
 * @fileoverview Recommendations request validation schemas.
 * Layer: Schema — Zod schema for AI recommendations endpoint.
 * Notes:
 * - Destination text is normalized (trim) before processing.
 */

import { z } from "zod";

export const recommendationSchema = z.object({
    // Target city/country/destination user asks recommendation for.
    destination: z.string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),
});

export type RecommendationSchema = z.infer<typeof recommendationSchema>;