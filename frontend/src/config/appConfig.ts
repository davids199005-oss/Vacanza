/**
 * @fileoverview App-wide configuration constants.
 * Layer: Config — API URLs, routes, storage keys, and endpoint helpers.
 * Notes:
 * - Centralized constants reduce hardcoded strings across codebase.
 */

// In Docker/production, VITE_API_BASE_URL is intentionally left empty so
// that all API calls use a relative path ("/api/..."). Nginx then proxies
// those requests to the backend container on the same origin.
// In local development (no env vars set), fall back to the explicit localhost URL.
const DEFAULT_API_BASE_URL = "http://localhost:3000/api";
const DEFAULT_ASSETS_BASE_URL = "http://localhost:3000/images";

// Use the env var when it is a non-empty string; otherwise use the dev default.
export const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL || "").length > 0
        ? import.meta.env.VITE_API_BASE_URL
        : DEFAULT_API_BASE_URL;

export const ASSETS_BASE_URL =
    (import.meta.env.VITE_ASSETS_BASE_URL || "").length > 0
        ? import.meta.env.VITE_ASSETS_BASE_URL
        : DEFAULT_ASSETS_BASE_URL;

// Derived URLs for image assets rendered in UI.
export const AVATAR_BASE_URL = `${ASSETS_BASE_URL}/avatars`;
export const VACATION_IMAGE_BASE_URL = `${ASSETS_BASE_URL}/vacations`;

// Local storage key used for JWT persistence.
export const TOKEN_STORAGE_KEY = "token";
// Allowed MIME list for file input `accept` attribute.
export const IMAGE_FILE_ACCEPT = "image/jpeg,image/png,image/webp";
// Default pagination page size for vacations list.
export const VACATIONS_ITEMS_PER_PAGE = 9;

// Frontend route constants used by router and links.
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

// Relative backend API endpoints consumed by API modules.
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

// Helper: admin edit page route for vacation id.
export const getAdminVacationEditRoute = (id: number | string): string =>
    `/admin/vacations/${id}/edit`;

// Helper: public details route for vacation id.
export const getVacationDetailsRoute = (id: number | string): string =>
    `/vacations/${id}`;

// Helper: backend endpoint for vacation by id.
export const getVacationByIdEndpoint = (id: number | string): string =>
    `/vacations/${id}`;

// Helper: backend endpoint for likes subresource.
export const getVacationLikeEndpoint = (vacationId: number | string): string =>
    `/vacations/${vacationId}/likes`;
