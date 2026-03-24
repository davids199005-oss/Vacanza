/**
 * @fileoverview Rate limiting configuration for the Vacanza API.
 * Layer: Config — defines per-endpoint request limits to prevent abuse.
 * Notes:
 * - Uses `express-rate-limit` with standard RFC headers.
 * - Endpoint-specific limiters are composed in `server.ts`.
 */

import rateLimit from "express-rate-limit";

/** Global rate limit: 1000 requests per 15 minutes across all endpoints. */
export const globalRateLimit = rateLimit({
    // 15-minute rolling window.
    windowMs: 15 * 60 * 1000,
    // Max allowed requests per IP in this window.
    max: 1000,
    // Consistent JSON message for client.
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

/** Auth rate limit: 50 requests per 15 minutes (login/register). */
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    // Auth endpoints need tighter limits to reduce brute-force risk.
    message: { message: "Too many login attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

/** AI recommendations rate limit: 50 requests per 15 minutes. */
export const recommendationsRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    // AI endpoints are protected due to higher compute cost.
    message: { message: "Too many AI requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

/** MCP (Model Context Protocol) rate limit: 50 requests per 15 minutes. */
export const mcpRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    // MCP endpoint limits tool-augmented AI traffic.
    message: { message: "Too many MCP requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});