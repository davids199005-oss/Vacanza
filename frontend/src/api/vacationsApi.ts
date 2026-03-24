/**
 * @fileoverview Vacations API client (CRUD, likes).
 * Layer: API — vacation management endpoints.
 * Notes:
 * - Create/update operations use multipart for optional image upload.
 */

import axiosInstance from "./axiosInstance";
import { VacationWithLikes, IVacation } from "../models/Vacation";
import {
    API_ENDPOINTS,
    getVacationByIdEndpoint,
    getVacationLikeEndpoint,
} from "../config/constants";

export const vacationsApi = {
    // Fetch all vacations with like metadata.
    getAll: () =>
        axiosInstance.get<VacationWithLikes[]>(API_ENDPOINTS.vacations),

    // Create new vacation record.
    add: (formData: FormData) =>
        axiosInstance.post<IVacation>(API_ENDPOINTS.vacations, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // Update existing vacation record by id.
    update: (id: number, formData: FormData) =>
        axiosInstance.put<IVacation>(getVacationByIdEndpoint(id), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // Delete vacation by id.
    delete: (id: number) =>
        axiosInstance.delete(getVacationByIdEndpoint(id)),

    // Add like for current user.
    addLike: (vacationId: number) =>
        axiosInstance.post(getVacationLikeEndpoint(vacationId)),

    // Remove like for current user.
    removeLike: (vacationId: number) =>
        axiosInstance.delete(getVacationLikeEndpoint(vacationId)),
};
