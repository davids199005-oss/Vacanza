/**
 * @fileoverview Zod-схемы валидации DTO вакаций (создание/редактирование).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает правила полей вакации (destination/description/даты/цена) и
 *   две специфичные схемы:
 *     - addVacationSchema    — для создания (запрещает start в прошлом);
 *     - updateVacationSchema — для редактирования (исторические даты разрешены).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Schema. Контроллеры vacations используют их при добавлении/обновлении
 *   вакаций. Многослойные refine-проверки гарантируют корректность дат до
 *   попадания в сервис и БД.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - baseVacationSchema — общие поля без правил по диапазону дат.
 *   - addVacationSchema  — блокирует startDate в прошлом + endDate > startDate.
 *   - updateVacationSchema — допускает прошлые даты (правка истории),
 *     но всё равно требует endDate > startDate.
 *   - vacationSchema     — алиас на addVacationSchema (обратная совместимость).
 */

import { z } from "zod";

/** Общие поля для add и update без правил диапазона дат. */
const baseVacationSchema = z.object({
    // Название направления (город / страна / место).
    destination: z
        .string({ message: "Destination is required" })
        .trim()
        .min(2, { message: "Destination must be at least 2 characters long" })
        .max(100, { message: "Destination must be at most 100 characters long" }),

    // Описание вакации, отображаемое в UI.
    description: z
        .string({ message: "Description is required" })
        .trim()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(1000, { message: "Description must be at most 1000 characters long" }),

    // Дата начала отпуска (приводится из строки в Date).
    startDate: z.coerce.date({ message: "Start date is required" }),

    // Дата окончания отпуска (приводится из строки в Date).
    endDate: z.coerce.date({ message: "End date is required" }),

    // Цена; на сервер приходит число, валидируем диапазон.
    price: z.coerce
        .number({ message: "Price is required" })
        .min(1, { message: "Price must be greater than 0" })
        .max(10000, { message: "Price must be at most 10,000" }),
});

/** Схема создания: дата начала не может быть в прошлом. */
export const addVacationSchema = baseVacationSchema
    // Новая вакация не должна начинаться в прошедшем дне.
    .refine(data => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Start date cannot be in the past",
        path: ["startDate"],
    })
    // Дата окончания всегда должна быть строго позже даты начала.
    .refine(data => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });

/** Схема обновления: прошлые даты допустимы (правка исторических записей). */
export const updateVacationSchema = baseVacationSchema
    // Даже при обновлении endDate должна оставаться позже startDate.
    .refine(data => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });

/** Алиас для addVacationSchema (для обратной совместимости с существующим кодом). */
export const vacationSchema = addVacationSchema;

export type AddVacationSchema = z.infer<typeof addVacationSchema>;
export type UpdateVacationSchema = z.infer<typeof updateVacationSchema>;
export type VacationSchema = z.infer<typeof addVacationSchema>;
