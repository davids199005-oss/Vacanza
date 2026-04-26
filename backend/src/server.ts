/**
 * @fileoverview Точка входа API-сервера Vacanza.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Главный исполняемый модуль backend-приложения. Создаёт экземпляр Express,
 *   собирает middleware-цепочку (безопасность, CORS, rate-limit, парсинг тел),
 *   регистрирует все API-роутеры, дожидается готовности БД и поднимает HTTP-сервер.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Application/Bootstrap. Здесь сходятся все остальные слои:
 *     Routes → Controllers → Services → Database.
 *   Этот файл не содержит бизнес-логики — только сборку приложения.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ (по шагам в `start()`):
 *   1. Создаёт приложение Express.
 *   2. Подключает security-middleware: helmet (HTTP-заголовки) и cors (CORS-политика).
 *   3. Включает глобальный rate limit для защиты всего API.
 *   4. Подключает парсеры body (JSON, urlencoded).
 *   5. Раздаёт статические изображения (аватары, фото вакаций).
 *   6. Регистрирует healthcheck `/ping` для Docker/мониторинга.
 *   7. Регистрирует бизнес-роуты с точечными rate-лимитерами там, где нужно жёстче.
 *   8. Подключает глобальный error-handler в конец цепочки.
 *   9. Дожидается доступности базы данных (`waitForDb`).
 *  10. Запускает HTTP-сервер на порту из переменных окружения.
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
        // Этап 1: создаём приложение Express и собираем middleware-цепочку.
        const server = express();

        // Этап 2: защитные HTTP-заголовки (helmet) и политика CORS.
        // Helmet отключает потенциально опасные заголовки и задаёт CSP,
        // CORS управляет тем, какие фронтенды могут обращаться к API.
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

        // Этап 3: базовый rate-limit для всей API-поверхности.
        // Подключаем как можно раньше, чтобы фильтровать паразитный трафик
        // ещё до парсинга тел и захода в роутеры.
        server.use(globalRateLimit);

        // Этап 4: парсинг тел запросов до попадания в контроллеры.
        // Поддерживаем JSON и form-urlencoded.
        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));

        // Этап 5: раздача статических изображений с диска.
        // Пути вида /images/vacations/<filename>, /images/avatars/<filename>.
        server.use("/images", express.static(path.join(process.cwd(), "assets/images")));

        // Этап 6: healthcheck-эндпоинт для Docker/оркестратора.
        // Возвращает 200 без тела — нужен только для проверки «жив ли сервис».
        server.get("/ping", (_req, res) => { res.sendStatus(200); });

        // Этап 7: регистрация бизнес-роутов и точечных rate-лимитов на чувствительные группы.
        //  - /api/auth          → жёсткий лимит, защита от перебора паролей;
        //  - /api/vacations     → обычный трафик, базовые лимиты;
        //  - /api/recommendations → AI-нагрузка, более строгий лимит;
        //  - /api/users         → управление пользователями (для админов);
        //  - /api/mcp и /mcp    → MCP-протокол, отдельный лимит для AI-инструментов.
        server.use("/api/auth", authRateLimit, authRouter);
        server.use("/api/vacations", vacationsRouter);
        server.use("/api/recommendations", recommendationsRateLimit, recommendationsRouter);
        server.use("/api/users", usersRouter);
        server.use("/api/mcp", mcpRateLimit, mcpRouter);
        server.use("/mcp", mcpRateLimit, mcpRouter);

        // Этап 8: единый обработчик ошибок ставится последним —
        // он ловит исключения и из синхронного, и из асинхронного кода всех вышестоящих слоёв.
        server.use(errorHandlerMiddleware);
        // Этап 9: до открытия HTTP-порта удостоверяемся, что БД отвечает.
        // Иначе сервис мог бы принимать запросы и падать на каждом из них.
        await waitForDb();
        // Этап 10: запускаем сервер и начинаем принимать входящий трафик.
        server.listen(env.PORT, () => {
            console.log(`Vacanza server running on port ${env.PORT} 🚀`);
        });
    }
}


const server = new Server();
server.start();
