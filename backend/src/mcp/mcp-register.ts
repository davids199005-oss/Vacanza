

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mcpTools } from "./mcp-tools.ts";

class McpRegister {

    public registerGetVacationsStatsTool(mcpServer: McpServer): void {
        
        mcpServer.registerTool(
            "getVacationsStats",
            { description: "Get statistics: total count, average price, active/upcoming/past counts" },
            () => mcpTools.getVacationsStatsTool()
        );
    }

    public registerGetVacationsWithLikesTool(mcpServer: McpServer): void {
        
        mcpServer.registerTool(
            "getVacationsWithLikes",
            { description: "Get all vacations with their like counts and status (active/upcoming/past)" },
            () => mcpTools.getVacationsWithLikesTool()
        );
    }

    public registerSearchByRegionTool(mcpServer: McpServer): void {
        
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
