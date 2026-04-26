/**
 * @fileoverview Zod-схемы для профиля и смены пароля.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает клиентские правила валидации для:
 *     - формы редактирования профиля (firstName/lastName/email);
 *     - формы смены пароля (currentPassword/newPassword/confirmPassword
 *       с проверкой совпадения).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema (фронт). Используется страницей Profile.
 *   Правила должны соответствовать серверным, иначе UI и сервер дадут
 *   противоречивую обратную связь пользователю.
 */

import { z } from "zod";

const nameRegex = /^[a-zA-Z]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const updateProfileSchema = z.object({
    // Валидация имени (2..50, только буквы).
    firstName: z
        .string({ message: "First name is required" })
        .trim()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name must be at most 50 characters long" })
        .regex(nameRegex, { message: "First name must contain only letters" }),

    // Валидация фамилии (2..50, только буквы).
    lastName: z
        .string({ message: "Last name is required" })
        .trim()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name must be at most 50 characters long" })
        .regex(nameRegex, { message: "Last name must contain only letters" }),

    // Email с нормализацией (trim + lowercase).
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase()
        .max(254, { message: "Email must be at most 254 characters long" }),
});

export const changePasswordSchema = z.object({
    // Текущий пароль — нужен для подтверждения операции.
    currentPassword: z
        .string({ message: "Current password is required" })
        .min(8, { message: "Current password must be at least 8 characters long" }),

    // Новый пароль с правилами сложности.
    newPassword: z
        .string({ message: "New password is required" })
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(72, { message: "Password must be at most 72 characters long" })
        .regex(passwordRegex, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
        }),

    // Подтверждение нового пароля.
    confirmPassword: z
        .string({ message: "Confirm password is required" })
        .min(8, { message: "Confirm password must be at least 8 characters long" }),
// Кросс-полевая проверка: новый пароль должен совпадать с подтверждением.
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
