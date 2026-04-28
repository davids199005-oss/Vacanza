

import OpenAI from "openai";
import { env } from "../configs/env-validator.ts";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { mcpSystemPrompt, mcpUserPrompt } from "../models/mcp-prompt-model.ts";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

class McpService {

    
    public async askQuestion(question: string): Promise<string> {
        
        const mcpClient = new Client({ name: "vacanza-client", version: "1.0.0" });
        const transport = new StreamableHTTPClientTransport(
            new URL(env.MCP_SERVER_URL)
        );
        
        await mcpClient.connect(transport);

        
        const { tools } = await mcpClient.listTools();

        const messages: ChatCompletionMessageParam[] = [
            mcpSystemPrompt,
            mcpUserPrompt(question),
        ];

        
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

        
        
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            
            messages.push(assistantMessage);

            for (const toolCall of assistantMessage.tool_calls) {
                if (toolCall.type !== "function") {
                    continue;
                }
                let args: Record<string, unknown> = {};
                try {
                    
                    args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;
                } catch {
                    args = {}; 
                }

                
                const toolResult = await mcpClient.callTool({
                    name: toolCall.function.name,
                    arguments: args,
                });

                
                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(toolResult.content),
                });
            }

            
            const finalResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
            });

            
            await mcpClient.close();
            return finalResponse.choices[0].message.content ?? "No response";
        }

        
        await mcpClient.close();
        return assistantMessage.content ?? "No response";
    }
}

export const mcpService = new McpService();
