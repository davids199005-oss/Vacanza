/**
 * @fileoverview Утилита упаковки результатов MCP-инструментов.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   MCP SDK ожидает, что каждый tool-handler вернёт объект CallToolResult
 *   с полем `content` определённой структуры. Этот хелпер избавляет
 *   обработчики инструментов от ручной сборки этого объекта.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util / интеграция с MCP. Используется в mcp-tools при возврате
 *   результатов SQL-запросов.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Сериализует произвольный объект в JSON.
 *   - Заворачивает строку в массив `content[{type:"text", text:...}]`.
 *   - Возвращает готовый CallToolResult, пригодный для возврата из tool-handler.
 */

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

class McpUtil {
    /** Сериализует контент в формат CallToolResult (text-payload). */
    public getToolResult<T>(content: T): CallToolResult {
        // Произвольный объект-результат сериализуем в JSON-строку и упаковываем в text-content.
        const result: CallToolResult = {
            content: [{ type: "text", text: JSON.stringify(content) }],
        };
        return result;
    }
}

export const mcpUtil = new McpUtil();
