/**
 * @fileoverview Промпты MCP-режима для ответа на вопросы по данным.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Содержит системный и пользовательский промпты для модели OpenAI,
 *   работающей в режиме Model Context Protocol (MCP). В MCP модель ходит
 *   не в свою «память», а в наши tools (функции к БД), и формирует ответ
 *   на их основе.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Domain. Промпты централизованы здесь, чтобы их легко было править
 *   без правки сервисного кода.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - mcpSystemPrompt   — задаёт системные ограничения: «отвечай по данным,
 *                          используй tools, будь кратким, не выдумывай».
 *   - mcpUserPrompt(q)  — заворачивает текст вопроса пользователя в формат
 *                          ChatCompletionMessageParam без преобразований.
 */

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

/** Системный промпт: инструктирует AI отвечать с использованием MCP-инструментов. */
export const mcpSystemPrompt: ChatCompletionMessageParam = {
    // Роль `system` определяет операционные ограничения ассистента.
    role: "system",
    // Жёсткие ограничения: использовать tool-данные, быть лаконичным, не галлюцинировать.
    content: `You are a helpful assistant that answers questions about vacation data.
    Use the available tools to get data from the database and answer precisely.
    Be concise and clear in your answers.
    Always base your answers on the data from the database.`,
};

/** Собирает пользовательский промпт из исходного вопроса. */
export const mcpUserPrompt = (question: string): ChatCompletionMessageParam => ({
    // Роль `user` несёт исходный вопрос из UI.
    role: "user",
    // Прозрачно прокидываем текст, чтобы не искажать намерение пользователя.
    content: question,
});
