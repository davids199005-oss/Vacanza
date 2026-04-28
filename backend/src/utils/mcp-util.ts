

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

class McpUtil {
    
    public getToolResult<T>(content: T): CallToolResult {
        
        const result: CallToolResult = {
            content: [{ type: "text", text: JSON.stringify(content) }],
        };
        return result;
    }
}

export const mcpUtil = new McpUtil();
