/**
 * @fileoverview Глобальный обработчик ошибок API.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Единая точка нормализации любых ошибок, возникающих в любом слое приложения,
 *   в стабильный JSON-контракт ответа клиенту. Подключается последним в `server.ts`.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Middleware. Контроллеры и сервисы НЕ формируют HTTP-ответ при ошибке —
 *   они только бросают исключения. Этот middleware гарантирует, что:
 *     - клиент получит понятный JSON и корректный HTTP-статус;
 *     - в production не утекут стектрейсы и внутренние сообщения;
 *     - в development разработчик увидит подробности.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ (в порядке проверок):
 *   1. multer.MulterError      → 400 (загрузка файла, например, превышен размер).
 *   2. ошибка фильтра multer   → 400 (неверный формат изображения).
 *   3. BaseError или ZodError  → status из BaseError или 400 для Zod.
 *      Дополнительно прикладывает `details` (Zod issues / ValidationError).
 *   4. Любая другая ошибка     → 500 + лог в консоль.
 *      В dev добавляются stack/message; в production — только generic-сообщение.
 */

import { BaseError, ValidationError } from "../errors/base-errors.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { Request, Response, NextFunction } from "express";
import { env } from "../configs/env-validator.ts";
import { ZodError } from "zod";
import multer from "multer";
import { INVALID_IMAGE_FORMAT_ERROR } from "../utils/multer-util.ts";

/** Обрабатывает BaseError, ZodError, MulterError и неизвестные ошибки; возвращает JSON. */
export function errorHandlerMiddleware(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // В dev-режиме добавляем подробности (stack/message), в production — нет.
    const isDevelopment = env.NODE_ENV === "development";

    // Сначала проверяем узкоспециализированные ошибки (multer, zod, доменные),
    // и только в самом конце — fallback на «неизвестную ошибку».

    // Ошибки загрузки файлов через multer (например, превышен размер файла).
    if (err instanceof multer.MulterError) {
        // Возвращаем безопасный для клиента ответ о неудачной загрузке.
        res.status(StatusCode.BAD_REQUEST).json({
            message: err.message,
            // Дополнительные подробности — только для dev-окружения.
            ...(isDevelopment && { details: err.message }),
        });
        return;
    }
    // fileFilter multer отверг файл из-за неподходящего формата изображения.
    if (err instanceof Error && err.message === INVALID_IMAGE_FORMAT_ERROR) {
        // Минимальный явный ответ о неверном типе файла.
        res.status(StatusCode.BAD_REQUEST).json({
            message: err.message,
        });
        return;
    }
    // Доменная ошибка нашего приложения или ошибка валидации Zod.
    if (err instanceof BaseError || err instanceof ZodError) {
        // Для BaseError используем её status, для Zod — стандартный 400.
        res.status(err instanceof BaseError ? err.status : StatusCode.BAD_REQUEST).json({
            // Для BaseError берём её сообщение, иначе подставляем общий заголовок.
            message: err instanceof BaseError ? err.message : "Validation error",
            // Stack полезен в dev, но не должен утекать в production.
            ...(isDevelopment && { stack: err.stack }),
            // Подробности кастомной ValidationError из домена.
            ...(err instanceof ValidationError && { details: err.details }),
            // Сообщения issues из ZodError склеиваем в одну строку через запятую.
            ...(err instanceof ZodError && { details: err.issues.map(issue => issue.message).join(", ") }),
        });
        return;
    }
    // Любая неизвестная ошибка → 500.
    else {
        // Подробно логируем неизвестную ошибку для диагностики на сервере.
        console.error("Unknown error ❌:", err);

        // Клиенту возвращаем обобщённое сообщение, не раскрывая внутренности.
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            // Опциональные подробности только в dev — ускоряют отладку локально.
            ...(isDevelopment && { details: err instanceof Error ? err.message : String(err) }),
        });
    }
}
