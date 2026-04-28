

import { z } from "zod";

// Validation schema for MCP chat questions.
export const mcpQuestionSchema = z.object({
    
    question: z.string({ message: "Question is required" })
        .trim()
        .min(2, { message: "Question must be at least 2 characters long" })
        .max(500, { message: "Question must be at most 500 characters long" }),
});

export type McpQuestionSchema = z.infer<typeof mcpQuestionSchema>;
