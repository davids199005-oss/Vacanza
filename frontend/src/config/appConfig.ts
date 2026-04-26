/**
 * @fileoverview Централизованные константы конфигурации фронтенда.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Один источник правды для:
 *     - базовых URL backend и статических ассетов;
 *     - набора путей роутера (ROUTES);
 *     - набора relative-путей API-эндпоинтов (API_ENDPOINTS);
 *     - вспомогательных хелперов для построения URL по id.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой config. Используется axios-инстансом, всеми API-модулями и
 *   роутером приложения. Выносит «магические строки» из кода.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Берёт VITE_API_BASE_URL / VITE_ASSETS_BASE_URL из env, иначе подставляет
 *     дефолты для локальной разработки (localhost:3000).
 *   - Производит AVATAR_BASE_URL и VACATION_IMAGE_BASE_URL.
 *   - Описывает константы хранилища токена и допустимых типов файлов.
 *   - Описывает объект ROUTES (фронтовые маршруты) и API_ENDPOINTS (URL API).
 *   - Экспортирует хелперы для составных URL (getVacationByIdEndpoint и т.п.).
 */

// Базовые URL: в Docker/production используем относительные пути через прокси,
// а в локальной разработке применяем явный localhost-fallback.
const DEFAULT_API_BASE_URL = "http://localhost:3000/api";
const DEFAULT_ASSETS_BASE_URL = "http://localhost:3000/images";

// Берём значение из env только если строка непустая, иначе используем дефолт.
export const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL || "").length > 0
        ? import.meta.env.VITE_API_BASE_URL
        : DEFAULT_API_BASE_URL;

export const ASSETS_BASE_URL =
    (import.meta.env.VITE_ASSETS_BASE_URL || "").length > 0
        ? import.meta.env.VITE_ASSETS_BASE_URL
        : DEFAULT_ASSETS_BASE_URL;

// Производные URL для аватаров и изображений отпусков.
export const AVATAR_BASE_URL = `${ASSETS_BASE_URL}/avatars`;
export const VACATION_IMAGE_BASE_URL = `${ASSETS_BASE_URL}/vacations`;

// Ключ localStorage, под которым хранится JWT.
export const TOKEN_STORAGE_KEY = "token";
// Список разрешённых MIME-типов для атрибута accept input[type=file].
export const IMAGE_FILE_ACCEPT = "image/jpeg,image/png,image/webp";
// Размер страницы пагинации списка вакаций.
export const VACATIONS_ITEMS_PER_PAGE = 9;

// Маршруты SPA — используются роутером и ссылками интерфейса.
export const ROUTES = {
    root: "/",
    login: "/login",
    register: "/register",
    about: "/about",
    vacations: "/vacations",
    vacationDetails: "/vacations/:id",
    recommendations: "/recommendations",
    mcp: "/mcp",
    profile: "/profile",
    adminVacations: "/admin/vacations",
    adminVacationNew: "/admin/vacations/new",
    adminVacationEditPattern: "/admin/vacations/:id/edit",
    adminReports: "/admin/reports",
} as const;

// Относительные пути API, которые используют все API-модули.
export const API_ENDPOINTS = {
    authRegister: "/auth/register",
    authLogin: "/auth/login",
    usersMe: "/users/me",
    usersAvatar: "/users/me/avatar",
    usersPassword: "/users/me/password",
    usersLikes: "/users/me/likes",
    vacations: "/vacations",
    recommendations: "/recommendations",
    mcpAsk: "/mcp/ask",
} as const;

// Хелпер: маршрут страницы редактирования вакации в админке.
export const getAdminVacationEditRoute = (id: number | string): string =>
    `/admin/vacations/${id}/edit`;

// Хелпер: публичный маршрут страницы деталей вакации.
export const getVacationDetailsRoute = (id: number | string): string =>
    `/vacations/${id}`;

// Хелпер: backend-эндпоинт для одной вакации по id.
export const getVacationByIdEndpoint = (id: number | string): string =>
    `/vacations/${id}`;

// Хелпер: backend-эндпоинт subresource «лайки» для вакации.
export const getVacationLikeEndpoint = (vacationId: number | string): string =>
    `/vacations/${vacationId}/likes`;
