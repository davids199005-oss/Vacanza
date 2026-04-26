/**
 * @fileoverview Сервис MCP: ответы на вопросы по данным через LLM + tools.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Оркестрирует цикл «AI → tool → AI» по протоколу Model Context Protocol:
 *   модель сначала решает, какой tool вызвать, бекенд выполняет SQL-запрос
 *   через MCP-сервер и возвращает данные модели, после чего модель формирует
 *   финальный ответ пользователю.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Service. Используется mcp-controller. На каждый запрос создаётся
 *   короткоживущий MCP-клиент, который закрывается в конце.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   1. Открывает StreamableHTTP-транспорт к MCP-серверу (env.MCP_SERVER_URL).
 *   2. Получает список доступных инструментов и преобразует их в формат
 *      function-tool OpenAI.
 *   3. Делает первый вызов модели с системным/пользовательским промптом и
 *      tool-декларациями (tool_choice = "auto").
 *   4. Если модель попросила вызвать tools — выполняет каждый через mcpClient,
 *      добавляет результаты обратно в messages и делает второй вызов модели,
 *      чтобы получить финальный ответ.
 *   5. Если tools не нужны — возвращает прямой ответ ассистента.
 *   6. В любом случае закрывает MCP-клиент.
 */

import OpenAI from "openai";
import { env } from "../configs/env-validator.ts";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { mcpSystemPrompt, mcpUserPrompt } from "../models/mcp-prompt-model.ts";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

class McpService {

    /** Отправляет вопрос модели с MCP-инструментами; обрабатывает цикл tool_calls. */
    public async askQuestion(question: string): Promise<string> {
        // Создаём экземпляр MCP-клиента на время одного запроса.
        const mcpClient = new Client({ name: "vacanza-client", version: "1.0.0" });
        const transport = new StreamableHTTPClientTransport(
            new URL(env.MCP_SERVER_URL)
        );
        // Открываем стрим-транспорт к эндпоинту MCP-сервера.
        await mcpClient.connect(transport);

        // Узнаём, какие tools предоставляет MCP-сервер, и описываем их модели.
        const { tools } = await mcpClient.listTools();

        const messages: ChatCompletionMessageParam[] = [
            mcpSystemPrompt,
            mcpUserPrompt(question),
        ];

        // Первый вызов модели с декларациями function-tools.
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            tools: tools.map(tool => ({
                type: "function" as const,
                function: {
                    name: tool.name,
                    description: tool.description ?? "",
                    parameters: tool.inputSchema as Record<string, unknown>,
                }
            })),
            tool_choice: "auto",
        });

        const assistantMessage = response.choices[0].message;

        // Обработка tool_calls: запускаем каждый, складываем результаты в messages,
        // затем делаем второй запрос модели для получения финального ответа.
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            // ВАЖНО: сообщение ассистента с tool_calls должно идти ДО tool-результатов.
            messages.push(assistantMessage);

            for (const toolCall of assistantMessage.tool_calls) {
                if (toolCall.type !== "function") {
                    continue;
                }
                let args: Record<string, unknown> = {};
                try {
                    // Парсим JSON-аргументы, которые модель сформировала для tool.
                    args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;
                } catch {
                    args = {}; // Если модель прислала невалидный JSON — передаём пустые args.
                }

                // Выполняем MCP-tool и собираем сырой результат.
                const toolResult = await mcpClient.callTool({
                    name: toolCall.function.name,
                    arguments: args,
                });

                // Возвращаем результат tool обратно модели как сообщение role: "tool".
                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(toolResult.content),
                });
            }

            // Второй вызов модели: синтезирует финальный ответ для пользователя.
            const finalResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
            });

            // Всегда закрываем MCP-клиент после завершения запроса.
            await mcpClient.close();
            return finalResponse.choices[0].message.content ?? "No response";
        }

        // Сценарий без tool_calls: возвращаем прямой ответ ассистента.
        await mcpClient.close();
        return assistantMessage.content ?? "No response";
    }
}

export const mcpService = new McpService();
