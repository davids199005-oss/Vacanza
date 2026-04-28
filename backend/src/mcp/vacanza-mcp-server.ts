

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register.ts";

class VacanzaMcpServer {

    
    public createMcpServer(): McpServer {
        
        const mcpServer = new McpServer({
            name: "vacanza-mcp",
            version: "1.0.0",
        });

        
        mcpRegister.registerGetVacationsStatsTool(mcpServer);
        mcpRegister.registerGetVacationsWithLikesTool(mcpServer);
        mcpRegister.registerSearchByRegionTool(mcpServer);
        mcpRegister.registerGetTopLikedTool(mcpServer);

        return mcpServer;
    }
}

export const vacanzaMcpServer = new VacanzaMcpServer();
