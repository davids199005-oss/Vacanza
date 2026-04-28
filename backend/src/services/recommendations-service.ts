import { env } from "../configs/env-validator.ts";
import OpenAI from "openai";
import { InternalServerError } from "../errors/base-errors.ts";
import { systemPrompt, userPrompt } from "../models/recommendations-prompt-model.ts";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

class RecommendationsService {
    public async generateTravelRecommendation(destination: string): Promise<string> {
        const messages: ChatCompletionMessageParam[] = [
            systemPrompt,
            userPrompt(destination)
        ];
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            max_tokens: 1000,
            messages,
        });
        const content = completion.choices?.[0]?.message?.content;
        if (!content) {
            throw new InternalServerError("Failed to generate travel recommendation");
        }

        return content;
    }
}

export const recommendationsService = new RecommendationsService();
