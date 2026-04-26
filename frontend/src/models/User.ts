/**
 * @fileoverview Доменные типы пользователя и аутентификации.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает все интерфейсы, связанные с пользователем на фронте:
 *   профиль (IUser), DTO логина/регистрации, обновления профиля и смены пароля,
 *   и формат ответа от auth-эндпоинтов.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Models. Эти типы циркулируют между API-клиентом, Redux Store и
 *   формами на странице Profile/Auth.
 */

import { Role } from "./Role";

export interface IUser {
    // Базовые поля учётной записи пользователя.
    id: number;
    // Имя пользователя.
    firstName: string;
    // Фамилия пользователя.
    lastName: string;
    // Email — используется для логина.
    email: string;
    // Роль для проверок RBAC.
    role: Role;
    // Имя файла аватара или null, если аватар не задан.
    avatar: string | null;
}

export interface LoginData {
    // Учётные данные для авторизации.
    email: string;
    // Пароль пользователя.
    password: string;
}

export interface RegisterData {
    // Имя для нового аккаунта.
    firstName: string;
    // Фамилия для нового аккаунта.
    lastName: string;
    // Email для нового аккаунта.
    email: string;
    // Пароль для нового аккаунта.
    password: string;
}

export interface AuthResponse {
    // Access-токен, который возвращает backend.
    token: string;
}

export interface UpdateProfileData {
    // Новые значения полей профиля.
    firstName: string;
    // Новое значение фамилии.
    lastName: string;
    // Новое значение email.
    email: string;
}

export interface ChangePasswordData {
    // Текущий пароль (для подтверждения операции).
    currentPassword: string;
    // Новый пароль.
    newPassword: string;
    // Подтверждение нового пароля (защита от опечатки).
    confirmPassword: string;
}
