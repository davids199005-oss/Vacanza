/**
 * @fileoverview AI travel recommendations via OpenAI.
 * Layer: Service — calls GPT with system/user prompts for destination advice.
 * Notes:
 * - Prompt composition is delegated to model files.
 * - Service validates that model returned non-empty content.
 */

import { env } from "../configs/env-validator.ts";
import OpenAI from "openai";
import { InternalServerError } from "../errors/base-errors.ts";
import { systemPrompt, userPrompt } from "../models/recommendations-prompt-model.ts";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

class RecommendationsService {

    /** Generates travel recommendation text for a destination. */
    public async generateTravelRecommendation(destination: string): Promise<string> {
        // Build system + user prompt message list for completion call.
        const messages: ChatCompletionMessageParam[] = [
            systemPrompt,
            userPrompt(destination)
        ];

        // Call OpenAI chat completion endpoint.
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            max_tokens: 1000,
            messages,
        });

        // Safely extract first assistant message content.
        const content = completion.choices?.[0]?.message?.content;
        if (!content) {
            // Explicit domain error when provider returned empty output.
            throw new InternalServerError("Failed to generate travel recommendation");
        }

        return content;
    }
}

export const recommendationsService = new RecommendationsService();