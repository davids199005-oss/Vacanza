/**
 * @fileoverview Роуты MCP-протокола и пользовательского эндпоинта /ask.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Подключает два разных по смыслу эндпоинта:
 *     - POST /     — транспортный MCP-эндпоинт (stateless): вызывается
 *                    нашим же mcp-service'ом изнутри для исполнения tool-ов.
 *     - POST /ask  — публичный (но защищённый) эндпоинт, через который
 *                    пользователь задаёт вопросы; внутри идёт оркестрация LLM + MCP.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Route. На уровне сервера (server.ts) обоим путям подключён mcpRateLimit.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - / (без auth) — `statelessHandler` создаёт MCP-сервер на каждый запрос
 *     и проксирует протокол. Аутентификации нет, потому что это внутренний канал.
 *   - /ask (auth) — нормальный пользовательский эндпоинт с authMiddleware.
 */

import { Router } from "express";
import { mcpController } from "../controllers/mcp-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { statelessHandler } from "express-mcp-handler";
import { vacanzaMcpServer } from "../mcp/vacanza-mcp-server.ts";

const mcpRouter = Router();

// MCP-протокол: без auth, потому что вызывается mcp-service'ом изнутри. /ask — приватный.
mcpRouter.post("/", statelessHandler(() => vacanzaMcpServer.createMcpServer()));

// Пользовательский Q&A-эндпоинт поверх MCP-инструментов.
mcpRouter.post("/ask", authMiddleware, mcpController.askQuestion);

export default mcpRouter;
