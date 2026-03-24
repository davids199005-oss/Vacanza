/**
 * @fileoverview MCP (Model Context Protocol) AI prompts.
 * Layer: Domain — system and user prompt templates for vacation Q&A.
 * Notes:
 * - System prompt forces data-grounded answers via MCP tools.
 * - User prompt passes raw question text without extra transformation.
 */

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

/** System prompt instructing the AI to answer using MCP tools. */
export const mcpSystemPrompt: ChatCompletionMessageParam = {
    // System role defines assistant operating constraints.
    role: "system",
    // Hard constraints: use tool data, be concise, avoid hallucinations.
    content: `You are a helpful assistant that answers questions about vacation data. 
    Use the available tools to get data from the database and answer precisely.
    Be concise and clear in your answers.
    Always base your answers on the data from the database.`,
};

/** Builds user prompt from the question. */
export const mcpUserPrompt = (question: string): ChatCompletionMessageParam => ({
    // User role contains original question from UI.
    role: "user",
    // Pass-through content preserves user intent exactly.
    content: question,
});