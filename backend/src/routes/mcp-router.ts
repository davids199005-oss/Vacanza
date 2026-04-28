

import { Router } from "express";
import { mcpController } from "../controllers/mcp-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { statelessHandler } from "express-mcp-handler";
import { vacanzaMcpServer } from "../mcp/vacanza-mcp-server.ts";

const mcpRouter = Router();


mcpRouter.post("/", statelessHandler(() => vacanzaMcpServer.createMcpServer()));


mcpRouter.post("/ask", authMiddleware, mcpController.askQuestion);

export default mcpRouter;
