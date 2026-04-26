/**
 * @fileoverview API-клиент аутентификации.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Содержит две функции для работы с публичными auth-эндпоинтами:
 *   register (создание аккаунта) и login (вход существующего пользователя).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой API-клиента. Используется страницами Auth (Login/Register) и
 *   слайсом TokenSlice. Не знает про state — просто возвращает Promise.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - register(data) — POST /api/auth/register, ожидает 201 + { token }.
 *   - login(data)    — POST /api/auth/login, ожидает 200 + { token }.
 */

import axiosInstance from "./axiosInstance";
import { AuthResponse, LoginData, RegisterData } from "../models/User";
import { API_ENDPOINTS } from "../config/appConfig";

export const authApi = {
    // Регистрация: создаём аккаунт и получаем JWT в ответе.
    register: (data: RegisterData) =>
        axiosInstance.post<AuthResponse>(API_ENDPOINTS.authRegister, data),

    // Логин: проверяем учётные данные и получаем JWT.
    login: (data: LoginData) =>
        axiosInstance.post<AuthResponse>(API_ENDPOINTS.authLogin, data),
};
