

import { z } from "zod";

export const recommendationSchema = z.object({
    
    destination: z
        .string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),
});

export const mcpQuestionSchema = z.object({
    
    question: z
        .string({ message: "Question is required" })
        .trim()
        .min(2, { message: "Question must be at least 2 characters long" })
        .max(500, { message: "Question must be at most 500 characters long" }),
});

export type RecommendationFormData = z.infer<typeof recommendationSchema>;
export type McpQuestionFormData = z.infer<typeof mcpQuestionSchema>;
