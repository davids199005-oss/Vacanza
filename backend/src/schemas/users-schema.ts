/**
 * @fileoverview Zod-схемы валидации пользовательских эндпоинтов.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает правила для двух операций над аккаунтом пользователя:
 *     - обновление профиля (имя/фамилия/email);
 *     - смена пароля (текущий + новый + подтверждение нового).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema. Контроллер users парсит body этими схемами перед вызовом
 *   сервиса, что делает невозможным попадание мусора в БД.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - updateProfileSchema — firstName/lastName (только буквы, 2..50),
 *     email (формат, lowercase, max 254).
 *   - changePasswordSchema — currentPassword (>=8), newPassword (8..72,
 *     политика сложности), confirmPassword + refine на совпадение
 *     newPassword === confirmPassword.
 */

import { z } from "zod";

export const updateProfileSchema = z.object({
    // Новое имя пользователя.
    firstName: z
        .string({ message: "First name is required" })
        .trim()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name must be at most 50 characters long" })
        .regex(/^[a-zA-Z]+$/, { message: "First name must contain only letters" }),

    // Новая фамилия пользователя.
    lastName: z
        .string({ message: "Last name is required" })
        .trim()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name must be at most 50 characters long" })
        .regex(/^[a-zA-Z]+$/, { message: "Last name must contain only letters" }),

    // Новый email (нормализован: trim + lowercase).
    email: z.email({ message: "Invalid email address" })
        .trim()
        .toLowerCase()
        .max(254, { message: "Email must be at most 254 characters long" }),
});

export const changePasswordSchema = z.object({
    // Текущий пароль — нужен для проверки права на изменение.
    currentPassword: z
        .string({ message: "Current password is required" })
        .min(8, { message: "Current password must be at least 8 characters long" }),

    // Новый пароль с правилами сложности.
    newPassword: z
        .string({ message: "New password is required" })
        .trim()
            .min(8, { message: "Password must be at least 8 characters long" })
        .max(72, { message: "Password must be at most 72 characters long" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/,
            { message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" }
        ),

    // Дублирующее поле нового пароля — защита от опечатки.
    confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters long" }),

// Финальная проверка: пользователь ввёл новый пароль одинаково в обоих полях.
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
