/**
 * @fileoverview MCP request validation schemas.
 * Layer: Schema — Zod schema for MCP ask endpoint.
 * Notes:
 * - Protects model call from empty or excessively long prompts.
 */

import { z } from "zod";

export const mcpQuestionSchema = z.object({
    // Natural language question to be answered via MCP tools.
    question: z.string({ message: "Question is required" })
        .trim()
        .min(2, { message: "Question must be at least 2 characters long" })
        .max(500, { message: "Question must be at most 500 characters long" }),
});

export type McpQuestionSchema = z.infer<typeof mcpQuestionSchema>;