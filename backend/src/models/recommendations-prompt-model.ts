/**
 * @fileoverview Travel recommendations AI prompts.
 * Layer: Domain — system and user prompt templates for recommendations.
 * Notes:
 * - `systemPrompt` defines assistant behavior and output format contract.
 * - `userPrompt` injects destination from request into user message.
 */

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

/** System prompt for the travel advisor persona. */
export const systemPrompt: ChatCompletionMessageParam = {
    // System role controls assistant-wide behavior.
    role: "system",
    // Instruction block used by LLM on every recommendation request.
    content:  `You are an expert travel advisor with years of experience 
helping people plan their dream vacations. You provide concise, practical, and personalized 
travel recommendations. Always structure your response with clear sections:
- Best time to visit
- Top attractions
- Local cuisine highlights
- Best restaurants
- Best hotels
- Local transportation tips
- Practical travel tips
- Interesting facts about the destination
Keep the friendly tone. Use emojis to make the text more engaging. Use markdown to format the text.`,
};

/** Builds user prompt for a destination. */
export const userPrompt = (destination: string): ChatCompletionMessageParam => ({
    // User role carries contextual request data (destination).
    role: "user",
    // Runtime destination interpolation.
    content: `Help me to plan my trip to: ${destination} at the end give me joke about ${destination}`,
});