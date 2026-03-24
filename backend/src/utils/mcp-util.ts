/**
 * @fileoverview MCP tool result formatting utility.
 * Layer: Util — wraps content into CallToolResult for MCP SDK.
 * Notes:
 * - MCP expects tool outputs in typed `content[]` structure.
 */

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

class McpUtil {
    /** Serializes content to MCP CallToolResult text format. */
    public getToolResult<T>(content: T): CallToolResult {
        // Serialize arbitrary result object into JSON text payload.
        const result: CallToolResult = {
            content: [{ type: "text", text: JSON.stringify(content) }],
        };
        return result;
    }
}

export const mcpUtil = new McpUtil();