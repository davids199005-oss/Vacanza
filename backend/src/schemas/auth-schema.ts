/**
 * @fileoverview Zod-схемы валидации auth-эндпоинтов (регистрация и логин).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает строгие правила, которым должны соответствовать тела запросов
 *   на `/api/auth/register` и `/api/auth/login`. Невалидный payload отсекается
 *   ещё до контроллера и возвращается клиенту как 400 Bad Request.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema — граница между внешним миром и доменом. Все строки
 *   нормализуются (trim, lowercase email), длина и формат жёстко контролируются.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - registerSchema — проверяет firstName/lastName (только буквы, длина 2..50),
 *     email (формат + max 254), password (длина 8..72 + комплексность:
 *     минимум 1 заглавная, 1 строчная, 1 цифра, 1 спецсимвол).
 *   - loginSchema    — менее строгое: только email и password (для bcrypt-сравнения).
 *   - Экспортирует TypeScript-типы, выведенные из схем.
 */

import { z } from "zod";

// Валидация входа auth-эндпоинтов: нормализуем строки и отсеиваем невалидный payload.
export const registerSchema = z.object({
    // Имя пользователя — используется в профиле и в payload JWT.
    firstName: z
    .string({ message: "First name is required" })
    .trim()
    .min(2 , { message: "First name must be at least 2 characters long" })
    .max(50 , { message: "First name must be at most 50 characters long" })
    .regex(/^[a-zA-Z]+$/, { message: "First name must contain only letters" }),
    // Фамилия — используется в профиле и в payload JWT.
    lastName: z
    .string({ message: "Last name is required" })
    .trim()
    .min(2 , { message: "Last name must be at least 2 characters long" })
    .max(50 , { message: "Last name must be at most 50 characters long" })
    .regex(/^[a-zA-Z]+$/, { message: "Last name must contain only letters" }),
    // Идентификатор для логина (приводим к lowercase, чтобы Email@x.com == email@x.com).
    email: z.email({ message: "Invalid email address" })
    .trim()
    .toLowerCase()
    .max(254 , { message: "Email must be at most 254 characters long" }),
    // Политика сложности пароля: длина + заглавная/строчная/цифра/спецсимвол.
    password: z
    .string({ message: "Password is required" })
    .trim()
    .min(8 , { message: "Password must be at least 8 characters long" })
    .max(72 , { message: "Password must be at most 72 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" }),

});

export const loginSchema = z.object({
    // Email для поиска учётных данных в БД.
    email: z.email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
    // Пароль — далее сравнивается с bcrypt-хешем из БД.
    password: z
    .string({ message: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(72, { message: "Password must be at most 72 characters long" })
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
