/**
 * @fileoverview Middleware JWT-аутентификации.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Извлекает Bearer-токен из заголовка Authorization, проверяет его подпись
 *   и срок действия, а распарсенный payload кладёт в `req.user` для использования
 *   downstream-обработчиками (контроллерами и middleware ролей).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Middleware. Это ключевой защитный слой API: ставится перед всеми
 *   приватными роутами. Без валидного токена запрос не дойдёт до контроллера.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   1. Читает заголовок `Authorization` входящего запроса.
 *   2. Проверяет, что он начинается с `Bearer ` (строгий формат).
 *   3. Извлекает сам JWT (часть после пробела).
 *   4. Проверяет подпись и валидность через утилиту `verifyToken`.
 *   5. Сохраняет распарсенный payload в `req.user`.
 *   6. На любую ошибку (нет заголовка, токен просрочен, невалиден)
 *      прокидывает `UnauthorizedError` через `next(error)`.
 */

import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/base-errors.ts";
import { verifyToken } from "../utils/jwt-util.ts";

/** Извлекает Bearer-токен, проверяет JWT, кладёт payload в req.user. */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    try {
        // Считываем «сырое» значение заголовка Authorization.
        const token = req.headers.authorization;
        // Ранний выход: заголовка нет или формат не соответствует "Bearer <token>".
        if (!token || !token.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authentication required");
        }
        // Формат заголовка — "Bearer <token>", элемент с индексом 1 — сам JWT.
        const tokenValue = token.split(" ")[1];
        // Проверяем целостность токена и достаём payload (id, email, role и т.п.).
        const decoded = verifyToken(tokenValue);
        // Сохраняем контекст пользователя на запросе для авторизационной логики ниже по цепочке.
        req.user = decoded;
        // Передаём управление следующему обработчику.
        next();
    } catch (error) {
        // Сбои аутентификации (просрочка/невалидная подпись) идут в централизованный обработчик.
        next(error);
    }
}
