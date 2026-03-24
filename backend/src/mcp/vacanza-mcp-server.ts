/**
 * @fileoverview Vacanza MCP server factory.
 * Layer: MCP — creates McpServer instance with all vacation tools registered.
 * Notes:
 * - Factory pattern creates fresh server instance per stateless MCP request.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register.ts";

class VacanzaMcpServer {

    /** Creates and returns a configured McpServer. */
    public createMcpServer(): McpServer {
        // Create MCP server identity exposed to clients.
        const mcpServer = new McpServer({
            name: "vacanza-mcp",
            version: "1.0.0",
        });

        // Register all supported vacation-related tools.
        mcpRegister.registerGetVacationsStatsTool(mcpServer);
        mcpRegister.registerGetVacationsWithLikesTool(mcpServer);
        mcpRegister.registerSearchByRegionTool(mcpServer);
        mcpRegister.registerGetTopLikedTool(mcpServer);

        return mcpServer;
    }
}

export const vacanzaMcpServer = new VacanzaMcpServer();