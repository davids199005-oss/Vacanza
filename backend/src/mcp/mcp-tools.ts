/**
 * @fileoverview MCP tools: vacation stats, search, top liked.
 * Layer: MCP — implements tools exposed to the AI via MCP protocol.
 * Notes:
 * - Each method executes SQL and formats output through `mcpUtil`.
 * - Tool outputs are JSON-text payloads compatible with MCP SDK.
 */

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { db } from "../configs/db-config.ts";
import { mcpUtil } from "../utils/mcp-util.ts";

class McpTools {

    /** Returns total count, avg/min/max price, active/upcoming/past counts. */
    public async getVacationsStatsTool(): Promise<CallToolResult> {
        // Aggregate global statistics across all vacations.
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                ROUND(AVG(price), 2) as avgPrice,
                MIN(price) as minPrice,
                MAX(price) as maxPrice,
                SUM(CASE WHEN start_date <= NOW() AND end_date >= NOW() THEN 1 ELSE 0 END) as activeNow,
                SUM(CASE WHEN start_date > NOW() THEN 1 ELSE 0 END) as upcoming,
                SUM(CASE WHEN end_date < NOW() THEN 1 ELSE 0 END) as past
            FROM vacations
        `);
        return mcpUtil.getToolResult(rows);
    }

    /** Returns all vacations with likes and status (active/upcoming/past). */
    public async getVacationsWithLikesTool(): Promise<CallToolResult> {
        // Join likes and compute status relative to current date.
        const [rows] = await db.execute(`
            SELECT 
                v.destination,
                v.start_date,
                v.end_date,
                v.price,
                COUNT(l.user_id) as likes,
                CASE 
                    WHEN start_date <= NOW() AND end_date >= NOW() THEN 'active'
                    WHEN start_date > NOW() THEN 'upcoming'
                    ELSE 'past'
                END as status
            FROM vacations v
            LEFT JOIN likes l ON v.id = l.vacation_id
            GROUP BY v.id
            ORDER BY v.start_date ASC
        `);
        return mcpUtil.getToolResult(rows);
    }

    /** Searches vacations by destination (LIKE %region%). */
    public async searchByRegionTool(args: { region: string }): Promise<CallToolResult> {
        // Pattern search by destination text.
        const [rows] = await db.execute(`
            SELECT 
                v.destination,
                v.start_date,
                v.end_date,
                v.price,
                COUNT(l.user_id) as likes
            FROM vacations v
            LEFT JOIN likes l ON v.id = l.vacation_id
            WHERE v.destination LIKE ?
            GROUP BY v.id
        `, [`%${args.region}%`]);
        return mcpUtil.getToolResult(rows);
    }

    /** Returns top liked vacations; default limit 5, max 100. */
    public async getTopLikedTool(args: { limit?: number }): Promise<CallToolResult> {
        // Return most liked vacations in descending order.
        const [rows] = await db.execute(`
            SELECT 
                v.destination,
                v.start_date,
                v.end_date,
                v.price,
                COUNT(l.user_id) as likes
            FROM vacations v
            LEFT JOIN likes l ON v.id = l.vacation_id
            GROUP BY v.id
            ORDER BY likes DESC
            LIMIT ?
        `, [args.limit ?? 5]);
        return mcpUtil.getToolResult(rows);
    }
}

export const mcpTools = new McpTools();