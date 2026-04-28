



const DEFAULT_API_BASE_URL = "http://localhost:3000/api";
const DEFAULT_ASSETS_BASE_URL = "http://localhost:3000/images";


export const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL || "").length > 0
        ? import.meta.env.VITE_API_BASE_URL
        : DEFAULT_API_BASE_URL;

export const ASSETS_BASE_URL =
    (import.meta.env.VITE_ASSETS_BASE_URL || "").length > 0
        ? import.meta.env.VITE_ASSETS_BASE_URL
        : DEFAULT_ASSETS_BASE_URL;


export const AVATAR_BASE_URL = `${ASSETS_BASE_URL}/avatars`;
export const VACATION_IMAGE_BASE_URL = `${ASSETS_BASE_URL}/vacations`;


export const TOKEN_STORAGE_KEY = "token";

export const IMAGE_FILE_ACCEPT = "image/jpeg,image/png,image/webp";


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


export const getAdminVacationEditRoute = (id: number | string): string =>
    `/admin/vacations/${id}/edit`;


export const getVacationDetailsRoute = (id: number | string): string =>
    `/vacations/${id}`;


export const getVacationByIdEndpoint = (id: number | string): string =>
    `/vacations/${id}`;


export const getVacationLikeEndpoint = (vacationId: number | string): string =>
    `/vacations/${vacationId}/likes`;
