/**
 * @fileoverview Сервис AI-рекомендаций путешествий.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Делает запрос к OpenAI Chat Completions с системным и пользовательским
 *   промптами и возвращает развернутый текстовый совет по направлению.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Service. Используется recommendations-controller. Сборка промптов
 *   делегирована модели `recommendations-prompt-model`.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Создаёт SDK-клиент OpenAI с ключом из env (один раз на модуль).
 *   - В методе generateTravelRecommendation формирует список messages
 *     [system, user(destination)] и вызывает chat.completions.create.
 *   - Использует модель gpt-4o-mini с лимитом 1000 токенов.
 *   - Если модель вернула пустой контент — бросает InternalServerError,
 *     чтобы клиент не получил «успешный» пустой ответ.
 */

import { env } from "../configs/env-validator.ts";
import OpenAI from "openai";
import { InternalServerError } from "../errors/base-errors.ts";
import { systemPrompt, userPrompt } from "../models/recommendations-prompt-model.ts";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

class RecommendationsService {

    /** Генерирует текстовую рекомендацию по направлению. */
    public async generateTravelRecommendation(destination: string): Promise<string> {
        // Собираем список сообщений system + user для completion-вызова.
        const messages: ChatCompletionMessageParam[] = [
            systemPrompt,
            userPrompt(destination)
        ];

        // Вызываем endpoint chat completion в OpenAI.
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            max_tokens: 1000,
            messages,
        });

        // Безопасно извлекаем текст первого ответа ассистента.
        const content = completion.choices?.[0]?.message?.content;
        if (!content) {
            // Явная доменная ошибка, если провайдер вернул пустой результат.
            throw new InternalServerError("Failed to generate travel recommendation");
        }

        return content;
    }
}

export const recommendationsService = new RecommendationsService();
