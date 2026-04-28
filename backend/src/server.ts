

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
        const server = express();

        // Apply security headers and strict browser protections.
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
        // Allow only the configured frontend origin to access the API.
        server.use(cors({
            origin: env.CORS_ORIGIN ?? (env.NODE_ENV === "production" ? "http://localhost" : "http://localhost:5173"),
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));

        // Apply a global rate limiter before routing.
        server.use(globalRateLimit);

        // Parse JSON and urlencoded request bodies.
        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));

        // Serve uploaded images from the assets directory.
        server.use("/images", express.static(path.join(process.cwd(), "assets/images")));

        // Lightweight health endpoint for uptime checks.
        server.get("/ping", (_req, res) => { res.sendStatus(200); });

        // Register feature routes with route-specific rate limits where needed.
        server.use("/api/auth", authRateLimit, authRouter);
        server.use("/api/vacations", vacationsRouter);
        server.use("/api/recommendations", recommendationsRateLimit, recommendationsRouter);
        server.use("/api/users", usersRouter);
        server.use("/api/mcp", mcpRateLimit, mcpRouter);
        server.use("/mcp", mcpRateLimit, mcpRouter);

        // Centralized error handling must be registered after all routes.
        server.use(errorHandlerMiddleware);
        // Ensure database connectivity before accepting incoming traffic.
        await waitForDb();

        server.listen(env.PORT, () => {
            console.log(`Vacanza server running on port ${env.PORT} 🚀`);
        });
    }
}


const server = new Server();
server.start();
