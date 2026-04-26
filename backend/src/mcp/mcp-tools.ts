/**
 * @fileoverview Реализации MCP-инструментов.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Содержит конкретные SQL-запросы, которые исполняются, когда AI-модель
 *   вызывает соответствующий tool через MCP. Каждый метод возвращает
 *   CallToolResult — стандартный формат ответа MCP SDK.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой MCP. По сути это мини-репозиторий «только для AI» — отделён от
 *   обычных backend-сервисов, чтобы tools имели чёткие границы и были
 *   безопасны для вызова через LLM.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ (по методам):
 *   - getVacationsStatsTool()        — общее число, мин/средняя/макс цена,
 *                                       и счётчики active/upcoming/past.
 *   - getVacationsWithLikesTool()    — все вакации с числом лайков и статусом
 *                                       relative to NOW().
 *   - searchByRegionTool({region})   — LIKE %region% по destination.
 *   - getTopLikedTool({limit?})      — топ-N лайкнутых; по умолчанию 5.
 *
 *   Все возвращаемые объекты упаковываются через `mcpUtil.getToolResult`
 *   в текстовый JSON-payload, понятный MCP-клиенту и LLM.
 */

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { db } from "../configs/db-config.ts";
import { mcpUtil } from "../utils/mcp-util.ts";

class McpTools {

    /** Считает агрегатную статистику по таблице vacations. */
    public async getVacationsStatsTool(): Promise<CallToolResult> {
        // Один SQL-запрос, чтобы получить все агрегаты сразу.
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

    /** Возвращает все вакации с числом лайков и статусом (active/upcoming/past). */
    public async getVacationsWithLikesTool(): Promise<CallToolResult> {
        // JOIN с likes и вычисление статуса относительно текущего времени.
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

    /** Поиск по подстроке в destination (LIKE %region%). */
    public async searchByRegionTool(args: { region: string }): Promise<CallToolResult> {
        // Параметризованный LIKE — безопасен для пользовательского ввода.
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

    /** Топ-N лайкнутых вакаций; по умолчанию 5, валидация max=100 — в schema. */
    public async getTopLikedTool(args: { limit?: number }): Promise<CallToolResult> {
        // Возвращаем самые лайкнутые вакации в убывающем порядке.
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
