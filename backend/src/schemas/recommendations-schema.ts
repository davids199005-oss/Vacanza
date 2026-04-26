/**
 * @fileoverview Zod-схема для эндпоинта AI-рекомендаций.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Валидирует поле `destination` в запросе POST /api/recommendations.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema. Гарантирует, что в LLM не уйдут пустые/слишком короткие или
 *   подозрительно длинные строки (защита от мусора и потенциальных атак на промпт).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Тримит destination и проверяет длину 2..100 символов.
 */

import { z } from "zod";

export const recommendationSchema = z.object({
    // Город/страна/направление, по которому пользователь просит рекомендацию.
    destination: z.string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),
});

export type RecommendationSchema = z.infer<typeof recommendationSchema>;
