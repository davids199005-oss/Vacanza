/**
 * @fileoverview API-клиент для работы с отпусками (CRUD + лайки).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Объединяет все запросы к /api/vacations: получение списка, создание,
 *   редактирование, удаление и операции лайков.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой API-клиента. Используется как обычными страницами (Vacations,
 *   VacationDetails), так и админскими (admin/VacationForm и др.).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - getAll             — GET /vacations.
 *   - add(formData)      — POST /vacations (multipart/form-data — есть файл).
 *   - update(id, fd)     — PUT  /vacations/:id (multipart/form-data).
 *   - delete(id)         — DELETE /vacations/:id.
 *   - addLike(id)        — POST /vacations/:id/likes.
 *   - removeLike(id)     — DELETE /vacations/:id/likes.
 */

import axiosInstance from "./axiosInstance";
import { VacationWithLikes, IVacation } from "../models/Vacation";
import {
    API_ENDPOINTS,
    getVacationByIdEndpoint,
    getVacationLikeEndpoint,
} from "../config/appConfig";

export const vacationsApi = {
    // Чтение: получаем список вакаций с метаданными лайков.
    getAll: () =>
        axiosInstance.get<VacationWithLikes[]>(API_ENDPOINTS.vacations),

    // Изменения: создание вакации через multipart/form-data (с файлом).
    add: (formData: FormData) =>
        axiosInstance.post<IVacation>(API_ENDPOINTS.vacations, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // Обновление существующей вакации по id (файл опционален).
    update: (id: number, formData: FormData) =>
        axiosInstance.put<IVacation>(getVacationByIdEndpoint(id), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // Удаление: удаляем вакацию по идентификатору.
    delete: (id: number) =>
        axiosInstance.delete(getVacationByIdEndpoint(id)),

    // Лайки: ставим лайк текущим пользователем.
    addLike: (vacationId: number) =>
        axiosInstance.post(getVacationLikeEndpoint(vacationId)),

    // Снимаем лайк текущего пользователя.
    removeLike: (vacationId: number) =>
        axiosInstance.delete(getVacationLikeEndpoint(vacationId)),
};
