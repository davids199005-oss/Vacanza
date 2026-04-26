/**
 * @fileoverview API-клиент пользовательского профиля и связанных операций.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Объединяет все запросы к /api/users/me/*: профиль, аватар, смена пароля,
 *   удаление аккаунта и список лайкнутых вакаций.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой API-клиента. Используется страницей Profile и связанными формами.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ (по методам):
 *   - getProfile         — GET /users/me, возвращает IUser.
 *   - updateProfile      — PUT /users/me, в ответе обновлённый JWT.
 *   - updateAvatar       — PATCH /users/me/avatar (multipart/form-data).
 *   - changePassword     — PATCH /users/me/password.
 *   - deleteAccount      — DELETE /users/me.
 *   - getLikedVacations  — GET /users/me/likes.
 */

import axiosInstance from "./axiosInstance";
import { IUser, UpdateProfileData, ChangePasswordData } from "../models/User";
import { VacationWithLikes } from "../models/Vacation";
import { API_ENDPOINTS } from "../config/appConfig";

export const usersApi = {
    // Профиль: чтение текущего пользователя.
    getProfile: () =>
        axiosInstance.get<IUser>(API_ENDPOINTS.usersMe),

    // Обновление полей профиля; в ответе приходит обновлённый JWT.
    updateProfile: (data: UpdateProfileData) =>
        axiosInstance.put<{ token: string }>(API_ENDPOINTS.usersMe, data),

    // Аватар: загрузка изображения через multipart/form-data.
    updateAvatar: (formData: FormData) =>
        axiosInstance.patch<{ avatar: string }>(API_ENDPOINTS.usersAvatar, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // Безопасность: смена пароля и удаление аккаунта.
    changePassword: (data: ChangePasswordData) =>
        axiosInstance.patch(API_ENDPOINTS.usersPassword, data),

    // Удаление текущего аккаунта.
    deleteAccount: () =>
        axiosInstance.delete(API_ENDPOINTS.usersMe),

    // Список вакаций, лайкнутых текущим пользователем.
    getLikedVacations: () =>
        axiosInstance.get<VacationWithLikes[]>(API_ENDPOINTS.usersLikes),
};
