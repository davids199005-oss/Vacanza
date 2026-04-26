/**
 * @fileoverview Zod-схема валидации MCP-эндпоинта.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Проверяет тело запроса POST /api/mcp/ask на корректность поля `question`.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema. Защищает дорогостоящий вызов LLM от пустых, шумовых
 *   или слишком длинных промптов, которые могут раздуть стоимость и
 *   ухудшить ответ модели.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Принимает объект с полем `question`.
 *   - Тримит пробелы, проверяет длину 2..500 символов.
 */

import { z } from "zod";

export const mcpQuestionSchema = z.object({
    // Вопрос на естественном языке, на который отвечает модель через MCP-инструменты.
    question: z.string({ message: "Question is required" })
        .trim()
        .min(2, { message: "Question must be at least 2 characters long" })
        .max(500, { message: "Question must be at most 500 characters long" }),
});

export type McpQuestionSchema = z.infer<typeof mcpQuestionSchema>;
