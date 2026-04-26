/**
 * @fileoverview Zod-схемы валидации формы вакации (create/update).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает клиентские правила для админских форм добавления и
 *   редактирования вакации.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema (фронт). Дублирует серверные правила, чтобы пользователь
 *   мгновенно видел ошибки. Дополнительно содержит refine-проверки на
 *   корректность диапазона дат.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - baseVacationSchema   — общие поля без правил по датам.
 *   - addVacationSchema    — для создания: startDate не в прошлом + endDate > startDate.
 *   - updateVacationSchema — для редактирования: только endDate > startDate.
 */

import { z } from "zod";

const baseVacationSchema = z.object({
    // Поле направления (2..100 символов).
    destination: z
        .string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),

    // Поле описания (10..1000 символов).
    description: z
        .string({ message: "Description is required" })
        .trim()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(1000, { message: "Description must be at most 1000 characters long" }),

    // Дата начала из date picker (как строка).
    startDate: z.string({ message: "Start date is required" }).min(1, { message: "Start date is required" }),

    // Дата окончания из date picker (как строка).
    endDate: z.string({ message: "End date is required" }).min(1, { message: "End date is required" }),

    // Цена (число, 1..10 000).
    price: z.coerce
        .number({ message: "Price is required" })
        .min(1, { message: "Price must be greater than 0" })
        .max(10000, { message: "Price must be at most 10,000" }),
});

export const addVacationSchema = baseVacationSchema
    // Правило для create: дата начала не может быть в прошлом.
    .refine(data => new Date(data.startDate) >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Start date cannot be in the past",
        path: ["startDate"],
    })
    // Общее правило: endDate должна быть строго позже startDate.
    .refine(data => new Date(data.endDate) > new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export const updateVacationSchema = baseVacationSchema
    // Правило для update: проверяем только порядок дат (история допустима).
    .refine(data => new Date(data.endDate) > new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    });

export type AddVacationFormData = z.infer<typeof addVacationSchema>;
export type UpdateVacationFormData = z.infer<typeof updateVacationSchema>;
