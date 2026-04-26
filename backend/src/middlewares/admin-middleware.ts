/**
 * @fileoverview Middleware проверки роли администратора (RBAC).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Защищает маршруты, доступные только администраторам. Должен подключаться
 *   ПОСЛЕ `authMiddleware`, поскольку требует уже распарсенного `req.user`.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Middleware (RBAC). Различает два разных отказа в доступе:
 *     - 401 Unauthorized — пользователь не аутентифицирован вовсе;
 *     - 403 Forbidden    — аутентифицирован, но не имеет роли admin.
 *   Это важно для корректного поведения клиента: на 401 он должен
 *   показать форму входа, а на 403 — сообщение «доступ запрещён».
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   1. Проверяет наличие `req.user` (его кладёт `authMiddleware`).
 *   2. Проверяет, что роль пользователя совпадает с `Role.ADMIN`.
 *   3. При успехе вызывает `next()` и передаёт управление дальше.
 *   4. При ошибке прокидывает её в `next(error)`, где её ловит
 *      глобальный `errorHandlerMiddleware`.
 */

import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/base-errors.ts";
import { Role } from "../enums/roles-enum.ts";

/** Гарантирует, что пользователь аутентифицирован и имеет роль admin. */
export function adminMiddleware(req: Request, _res: Response, next: NextFunction): void {
    try {
        // На запросе нет распарсенного токена — значит, аутентификация не пройдена.
        if (!req.user) {
            throw new UnauthorizedError("Authentication required");
        }

        // Аутентифицирован, но роль не админская — запрещаем действие.
        if (req.user.role !== Role.ADMIN) {
            throw new ForbiddenError("Access denied");
        }

        // Доступ разрешён — продолжаем цепочку обработчиков.
        next();
    } catch (error) {
        // Любая ошибка передаётся глобальному error-handler middleware.
        next(error);
    }
}
