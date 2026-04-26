/**
 * @fileoverview Промпты для генерации travel-рекомендаций через LLM.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Содержит системный промпт «персонажа» (опытный travel-эдвайзер) и шаблон
 *   пользовательского промпта, в который подставляется выбранное направление.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Domain. Используется в `recommendations-service` при формировании
 *   запроса к OpenAI Chat Completions API.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - systemPrompt        — задаёт стиль и структуру ответа: список секций
 *                            (лучшее время поездки, достопримечательности, кухня,
 *                            рестораны, отели, транспорт, советы, факты).
 *   - userPrompt(dest)    — генерирует пользовательское сообщение, в котором
 *                            направление подставляется в текст запроса.
 */

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

/** Системный промпт для роли «travel advisor». */
export const systemPrompt: ChatCompletionMessageParam = {
    // Роль `system` управляет общим поведением ассистента.
    role: "system",
    // Блок инструкций используется LLM при каждом запросе на рекомендации.
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

/** Собирает пользовательский промпт по конкретному направлению. */
export const userPrompt = (destination: string): ChatCompletionMessageParam => ({
    // Роль `user` несёт контекст запроса (название направления).
    role: "user",
    // В рантайме подставляем выбранное направление в текст промпта.
    content: `Help me to plan my trip to: ${destination} at the end give me joke about ${destination}`,
});
