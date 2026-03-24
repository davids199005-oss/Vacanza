/**
 * @fileoverview MCP routes: protocol endpoint and ask endpoint.
 * Layer: Route — POST / is stateless MCP (no auth, called by mcp-service internally);
 * POST /ask requires auth and is rate-limited.
 * Notes:
 * - `/` hosts MCP protocol transport for tool execution.
 * - `/ask` is app-facing endpoint that uses auth + mcpService.
 */

import { Router } from "express";
import { mcpController } from "../controllers/mcp-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { statelessHandler } from "express-mcp-handler";
import { vacanzaMcpServer } from "../mcp/vacanza-mcp-server.ts";

const mcpRouter = Router();

// MCP protocol: no auth (called internally by mcp-service); /ask is protected
mcpRouter.post("/", statelessHandler(() => vacanzaMcpServer.createMcpServer()));

// User-facing Q&A endpoint over MCP tools.
mcpRouter.post("/ask", authMiddleware, mcpController.askQuestion);

export default mcpRouter;