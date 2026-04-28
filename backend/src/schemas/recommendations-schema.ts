

import { z } from "zod";

// Validation schema for recommendation prompts.
export const recommendationSchema = z.object({
    
    destination: z.string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),
});

export type RecommendationSchema = z.infer<typeof recommendationSchema>;
