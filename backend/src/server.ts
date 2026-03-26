/**
 * @fileoverview Vacanza API server entry point.
 * Layer: Application — DB connection, Express setup, middleware, routes.
 * Notes:
 * - Validates DB connectivity before accepting HTTP traffic.
 * - Composes endpoint-specific rate limiters in server setup.
 */

import { env } from "./configs/env-validator.ts";
import { errorHandlerMiddleware } from "./middlewares/error-handler-middleware.ts";
import { globalRateLimit, authRateLimit, recommendationsRateLimit, mcpRateLimit } from "./configs/ratelimit-config.ts";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import recommendationsRouter from "./routes/recommendations-router.ts";
import authRouter from "./routes/auth-router.ts";
import vacationsRouter from "./routes/vacations-router.ts";
import usersRouter from "./routes/users-router.ts";
import mcpRouter from "./routes/mcp-router.ts";
import { waitForDb } from "./configs/db-config.ts";
class Server {
    public async start(): Promise<void> {
        // Build app and register security middleware first.
        const server = express();
        
        server.use(helmet(
            {
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        imgSrc: ["'self'", "data:"],
                        scriptSrc: ["'self'"],
                    }
                },
                crossOriginResourcePolicy: { policy: "cross-origin" },
                frameguard: {
                    action: "deny",
                },
                xssFilter: true,
                noSniff: true,
            }
        ));
        server.use(cors({
            origin: env.CORS_ORIGIN ?? (env.NODE_ENV === "production" ? "http://localhost" : "http://localhost:5173"),
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));

        // Apply global throttling early to protect all routes.
        server.use(globalRateLimit);

        // Parse request bodies before route handlers.
        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));

        // Static files: /images/vacations/<filename>, /images/avatars/<filename>
        server.use("/images", express.static(path.join(process.cwd(), "assets/images")));

        // Health check for Docker.
        server.get("/ping", (_req, res) => { res.sendStatus(200); });

        // Register API routes (some endpoints use stricter per-route limits).
        server.use("/api/auth", authRateLimit, authRouter);
        server.use("/api/vacations", vacationsRouter);
        server.use("/api/recommendations", recommendationsRateLimit, recommendationsRouter);
        server.use("/api/users", usersRouter);
        server.use("/api/mcp", mcpRateLimit, mcpRouter);
        server.use("/mcp", mcpRateLimit, mcpRouter);

        // Keep error handler last so all upstream errors are captured.
        server.use(errorHandlerMiddleware);
        await waitForDb();
        server.listen(env.PORT, () => {
            console.log(`Vacanza server running on port ${env.PORT} 🚀`);
        });
    }
}


const server = new Server();
server.start();

