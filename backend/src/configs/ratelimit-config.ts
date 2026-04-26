/**
 * @fileoverview Конфигурация ограничений по числу запросов (rate limiting).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает четыре middleware-лимитера для разных групп API-эндпоинтов:
 *   глобальный, аутентификация, AI-рекомендации и MCP. Подключаются в `server.ts`.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Config / защитный слой. Используется для предотвращения злоупотреблений API:
 *   брутфорс паролей, флуд тяжёлых AI-запросов, перегрузка инфраструктуры.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Создаёт лимитеры на основе `express-rate-limit` со стандартными RFC-заголовками
 *     (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`).
 *   - Возвращает клиенту JSON-ответ с понятным сообщением при превышении лимита.
 *   - Лимиты подобраны по чувствительности эндпоинтов:
 *       * глобальный (1000/15мин)        — мягкий, на весь API;
 *       * auth (5/15мин)                  — жёсткий, против перебора паролей;
 *       * recommendations (30/15мин)      — средний, защита AI-нагрузки;
 *       * mcp (20/15мин)                  — средний, дороже обычного запроса.
 */

import rateLimit from "express-rate-limit";

/** Глобальный лимит: 1000 запросов на 15 минут с одного IP по всем эндпоинтам. */
export const globalRateLimit = rateLimit({
    // Скользящее окно длиной 15 минут.
    windowMs: 15 * 60 * 1000,
    // Максимально разрешённое количество запросов на IP за окно.
    max: 1000,
    // Единое JSON-сообщение для клиента при превышении.
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

/** Лимит для auth-эндпоинтов: 5 запросов на 15 минут (login/register). */
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    // На auth ставим жёсткий лимит, чтобы снизить риск перебора паролей.
    message: { message: "Too many login attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

/** Лимит для AI-рекомендаций: 30 запросов на 15 минут. */
export const recommendationsRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    // AI-эндпоинты ограничиваем сильнее, потому что каждый вызов — это
    // оплачиваемый трафик к OpenAI и нагрузка на CPU.
    message: { message: "Too many AI requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

/** Лимит для MCP-протокола (Model Context Protocol): 20 запросов на 15 минут. */
export const mcpRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    // MCP-эндпоинт обслуживает «инструментальный» AI-трафик, который дороже
    // обычного API-запроса, поэтому ограничен жёстче.
    message: { message: "Too many MCP requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
