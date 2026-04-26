/**
 * @fileoverview Zod-схемы для AI-эндпоинтов (рекомендации и MCP-чат).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает клиентскую валидацию для двух AI-форм:
 *     - запрос рекомендации по направлению;
 *     - вопрос для MCP-чата.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema (фронт). Дублирует серверные правила, чтобы пользователь
 *   видел ошибки сразу в UI и не делал лишний запрос на сервер.
 */

import { z } from "zod";

export const recommendationSchema = z.object({
    // Валидируем направление (2..100 символов, тримим пробелы).
    destination: z
        .string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),
});

export const mcpQuestionSchema = z.object({
    // Валидируем текст вопроса перед отправкой (2..500 символов).
    question: z
        .string({ message: "Question is required" })
        .trim()
        .min(2, { message: "Question must be at least 2 characters long" })
        .max(500, { message: "Question must be at most 500 characters long" }),
});

export type RecommendationFormData = z.infer<typeof recommendationSchema>;
export type McpQuestionFormData = z.infer<typeof mcpQuestionSchema>;
