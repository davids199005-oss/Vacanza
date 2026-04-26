/**
 * @fileoverview Фабрика MCP-сервера Vacanza.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Создаёт новый экземпляр McpServer на каждый запрос (паттерн «фабрика»).
 *   Все доступные tools регистрируются здесь через `mcpRegister`.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой MCP. Используется stateless-обработчиком в `mcp-router.ts`:
 *   на каждый POST / создаётся свежий сервер, выполняется протокольный
 *   обмен и сервер выбрасывается. Это даёт полную изоляцию между запросами.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Конструирует McpServer с именем "vacanza-mcp" и версией.
 *   - Регистрирует на нём все четыре tool-а (статистика, список, поиск, топ).
 *   - Возвращает готовый сервер обратно вызывающему коду.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register.ts";

class VacanzaMcpServer {

    /** Создаёт и возвращает сконфигурированный McpServer. */
    public createMcpServer(): McpServer {
        // Идентификация MCP-сервера, которую видит клиент при подключении.
        const mcpServer = new McpServer({
            name: "vacanza-mcp",
            version: "1.0.0",
        });

        // Регистрируем все поддерживаемые tools, связанные с вакациями.
        mcpRegister.registerGetVacationsStatsTool(mcpServer);
        mcpRegister.registerGetVacationsWithLikesTool(mcpServer);
        mcpRegister.registerSearchByRegionTool(mcpServer);
        mcpRegister.registerGetTopLikedTool(mcpServer);

        return mcpServer;
    }
}

export const vacanzaMcpServer = new VacanzaMcpServer();
