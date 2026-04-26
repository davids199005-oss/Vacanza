/**
 * @fileoverview Регистрация MCP-инструментов на сервере.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает, какие именно tools (имена, описания, схемы аргументов) MCP-сервер
 *   декларирует наружу. Каждый зарегистрированный tool «видит» AI-модель и может
 *   его вызвать.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой MCP. Связывает декларацию tool (имя + JSON-схема входа) с её
 *   реализацией из `mcp-tools`. Используется фабрикой `vacanzaMcpServer`.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - getVacationsStats        — без аргументов, отдаёт сводную статистику.
 *   - getVacationsWithLikes    — без аргументов, отдаёт все вакации с лайками.
 *   - searchByRegion(region)   — поиск по подстроке в destination.
 *   - getTopLiked(limit?)      — топ-N лайкнутых, limit ограничен 1..100.
 *
 *   Имена tools здесь должны совпадать с теми, которые модель использует при
 *   tool-calling, иначе вызов не дойдёт до реализации.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mcpTools } from "./mcp-tools.ts";

class McpRegister {

    public registerGetVacationsStatsTool(mcpServer: McpServer): void {
        // Tool без аргументов: статистика по всему набору вакаций.
        mcpServer.registerTool(
            "getVacationsStats",
            { description: "Get statistics: total count, average price, active/upcoming/past counts" },
            () => mcpTools.getVacationsStatsTool()
        );
    }

    public registerGetVacationsWithLikesTool(mcpServer: McpServer): void {
        // Tool без аргументов: список вакаций с числом лайков и статусом.
        mcpServer.registerTool(
            "getVacationsWithLikes",
            { description: "Get all vacations with their like counts and status (active/upcoming/past)" },
            () => mcpTools.getVacationsWithLikesTool()
        );
    }

    public registerSearchByRegionTool(mcpServer: McpServer): void {
        // Tool с обязательным аргументом `region` (строка для подстрочного поиска).
        mcpServer.registerTool(
            "searchByRegion",
            {
                description: "Search vacations by destination, region or country name",
                inputSchema: z.object({
                    region: z.string().describe("Region, country or city to search for")
                })
            },
            (args) => mcpTools.searchByRegionTool(args)
        );
    }

    public registerGetTopLikedTool(mcpServer: McpServer): void {
        // Tool с опциональным аргументом `limit` (1..100), по умолчанию 5.
        mcpServer.registerTool(
            "getTopLiked",
            {
                description: "Get most liked vacations sorted by number of likes",
                inputSchema: z.object({
                    limit: z.number().int().min(1).max(100).optional().describe("Number of results to return, default 5 and max 100")
                })
            },
            (args) => mcpTools.getTopLikedTool(args)
        );
    }
}

export const mcpRegister = new McpRegister();
