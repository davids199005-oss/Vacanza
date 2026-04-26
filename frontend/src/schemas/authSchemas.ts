/**
 * @fileoverview Zod-схемы валидации форм входа и регистрации.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Дублирует серверные правила auth-схем (длина, regex и т.д.) для
 *   мгновенной проверки в форме до отправки запроса на backend.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema (фронт). Используется страницами Login/Register совместно
 *   с react-hook-form и zod-resolver.
 */

import { z } from "zod";

const nameRegex = /^[a-zA-Z]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
    // Имя: длина 2..50 и только буквы.
    firstName: z
        .string({ message: "First name is required" })
        .trim()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name must be at most 50 characters long" })
        .regex(nameRegex, { message: "First name must contain only letters" }),

    // Фамилия: длина 2..50 и только буквы.
    lastName: z
        .string({ message: "Last name is required" })
        .trim()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name must be at most 50 characters long" })
        .regex(nameRegex, { message: "Last name must contain only letters" }),

    // Email: валидация формата + нормализация (trim + lowercase).
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase()
        .max(254, { message: "Email must be at most 254 characters long" }),

    // Политика сложности пароля при регистрации.
    password: z
        .string({ message: "Password is required" })
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(72, { message: "Password must be at most 72 characters long" })
        .regex(passwordRegex, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" }),
});

export const loginSchema = z.object({
    // Email-поле для логина.
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase(),

    // Пароль для логина.
    password: z
        .string({ message: "Password is required" })
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(72, { message: "Password must be at most 72 characters long" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
