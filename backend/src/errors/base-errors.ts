/**
 * @fileoverview Иерархия доменных ошибок API.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает кастомные классы ошибок, каждый из которых жёстко привязан
 *   к конкретному HTTP-статусу. Позволяет сервисам и контроллерам бросать
 *   осмысленные ошибки вместо «голых» строк или объектов Error.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Domain (errors). Сервисы выбрасывают эти ошибки при нарушении
 *   бизнес-правил, контроллеры — при невалидных запросах, а глобальный
 *   error-handler-middleware читает поле `status` и формирует HTTP-ответ.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - BaseError       — корневой класс, держит сообщение и status.
 *   - NotFoundError   — 404, когда сущность не найдена.
 *   - UnauthorizedError — 401, нет/невалидный токен.
 *   - ForbiddenError  — 403, нет прав (RBAC).
 *   - ConflictError   — 409, конфликт уникальности (например, email).
 *   - BadRequestError — 400, нарушены бизнес-предусловия.
 *   - InternalServerError — 500, неожиданная серверная ошибка.
 *   - ValidationError — 400 + структурированные details (формируются из Zod).
 */

import { StatusCode } from "../enums/status-codes-enum.ts";

/** Базовый класс ошибок API: хранит читаемое сообщение и HTTP-статус. */
export class BaseError extends Error {
    // HTTP-статус, в который будет сериализована эта ошибка обработчиком.
    public status: StatusCode;

    constructor(message: string, status: StatusCode) {
        // Сохраняем человекочитаемое сообщение об ошибке.
        super(message);
        // Подменяем имя ошибки на имя дочернего класса — так удобнее в логах.
        this.name = this.constructor.name;
        // Сохраняем HTTP-статус для использования в middleware-обработчике.
        this.status = status;

    }
}

/** 404 Not Found — сущность не найдена. */
export class NotFoundError extends BaseError {
    constructor(message: string = 'Resource not found') {
        // Семантически соответствует «ресурс не существует».
        super(message, StatusCode.NOT_FOUND);
    }
}

/** 401 Unauthorized — отсутствует или невалидна аутентификация. */
export class UnauthorizedError extends BaseError {
    constructor(message: string = 'Unauthorized') {
        // Используется при отсутствии/некорректном JWT-токене.
        super(message, StatusCode.UNAUTHORIZED);
    }
}

/** 403 Forbidden — нет прав на действие (RBAC). */
export class ForbiddenError extends BaseError {
    constructor(message: string = 'Forbidden') {
        // Используется, когда пользователь аутентифицирован, но роль не позволяет.
        super(message, StatusCode.FORBIDDEN);
    }
}

/** 409 Conflict — конфликт данных (например, дубликат email при регистрации). */
export class ConflictError extends BaseError {
    constructor(message: string = 'Conflict') {
        // Используется при нарушениях уникальности или доменных конфликтах.
        super(message, StatusCode.CONFLICT);
    }
}

/** 400 Bad Request — некорректный ввод или бизнес-предусловие нарушено. */
export class BadRequestError extends BaseError {
    constructor(message: string = 'Bad Request') {
        // Используется при невалидном вводе или нарушении доменных правил.
        super(message, StatusCode.BAD_REQUEST);
    }
}

/** 500 Internal Server Error — непредвиденная ошибка сервера. */
export class InternalServerError extends BaseError {
    constructor(message: string = 'Internal Server Error') {
        // Используется для невосстановимых ошибок на стороне сервера.
        super(message, StatusCode.INTERNAL_SERVER_ERROR);
    }
}

/** 400 Bad Request с дополнительными подробностями валидации (детали из Zod). */
export class ValidationError extends BaseError {
    // Дополнительный структурированный контекст ошибки валидации.
    public details: string;
    constructor(message: string, details: string) {
        // Ошибки валидации — это проблема ввода клиента → 400.
        super(message, StatusCode.BAD_REQUEST);
        // Подробности кладём отдельным полем для отображения в ответе API.
        this.details = details;
    }
}
