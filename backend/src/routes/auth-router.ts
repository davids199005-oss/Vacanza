/**
 * @fileoverview Роуты аутентификации (публичные).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Подключает два публичных эндпоинта для регистрации и логина пользователя.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Route. Не вешает authMiddleware — эти эндпоинты по дизайну открыты
 *   (нельзя залогиниться, не имея токена). Защита от брутфорса осуществляется
 *   через `authRateLimit`, который подключается уровнем выше — в server.ts.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - POST /register — создание нового аккаунта.
 *   - POST /login    — вход существующего пользователя.
 *   Валидация тел запросов выполняется в контроллере через Zod.
 */

import { Router } from "express";
import { authController } from "../controllers/auth-controller.ts";

const authRouter = Router();

// Создаёт нового пользователя и возвращает JWT.
authRouter.post("/register", authController.register);
// Аутентифицирует существующего пользователя и возвращает JWT.
authRouter.post("/login", authController.login);

export default authRouter;
