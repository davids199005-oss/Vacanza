/**
 * @fileoverview MCP (Model Context Protocol) service: answers vacation questions via AI + tools.
 * Layer: Service — connects to MCP server, calls tools, returns GPT response.
 * Notes:
 * - Establishes short-lived MCP client per request.
 * - Supports tool-calling loop (assistant -> tool -> assistant final answer).
 */

import OpenAI from "openai";
import { env } from "../configs/env-validator.ts";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { mcpSystemPrompt, mcpUserPrompt } from "../models/mcp-prompt-model.ts";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

class McpService {

    /** Sends question to GPT with MCP tools; handles tool_calls loop. */
    public async askQuestion(question: string): Promise<string> {
        // Create MCP client instance for this request lifecycle.
        const mcpClient = new Client({ name: "vacanza-client", version: "1.0.0" });
        const transport = new StreamableHTTPClientTransport(
            new URL(env.MCP_SERVER_URL)
        );
        // Open stream transport to MCP server endpoint.
        await mcpClient.connect(transport);

        // Discover available server-side tools and expose them to model.
        const { tools } = await mcpClient.listTools();

        const messages: ChatCompletionMessageParam[] = [
            mcpSystemPrompt,
            mcpUserPrompt(question),
        ];

        // Initial model call with function-tool declarations.
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

        // Handle tool_calls: execute each, append results, get final response
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            // Append assistant tool-call message before tool results.
            messages.push(assistantMessage);

            for (const toolCall of assistantMessage.tool_calls) {
                if (toolCall.type !== "function") {
                    continue;
                }
                let args: Record<string, unknown> = {};
                try {
                    // Parse model-provided JSON arguments for target tool.
                    args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;
                } catch {
                    args = {}; // Invalid JSON from model
                }

                // Execute MCP tool and collect raw tool output.
                const toolResult = await mcpClient.callTool({
                    name: toolCall.function.name,
                    arguments: args,
                });

                // Feed tool output back to model as `tool` role message.
                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(toolResult.content),
                });
            }

            // Second model call: synthesize final user-facing answer.
            const finalResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
            });

            // Always close MCP client after request completion.
            await mcpClient.close();
            return finalResponse.choices[0].message.content ?? "No response";
        }

        // No tool call path: return direct assistant response.
        await mcpClient.close();
        return assistantMessage.content ?? "No response";
    }
}

export const mcpService = new McpService();