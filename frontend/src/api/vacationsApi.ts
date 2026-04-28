

import axiosInstance from "./axiosInstance";
import { VacationWithLikes, IVacation } from "../models/Vacation";
import {
    API_ENDPOINTS,
    getVacationByIdEndpoint,
    getVacationLikeEndpoint,
} from "../config/appConfig";

export const vacationsApi = {
    
    getAll: () =>
        axiosInstance.get<VacationWithLikes[]>(API_ENDPOINTS.vacations),

    
    add: (formData: FormData) =>
        axiosInstance.post<IVacation>(API_ENDPOINTS.vacations, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    
    update: (id: number, formData: FormData) =>
        axiosInstance.put<IVacation>(getVacationByIdEndpoint(id), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    
    delete: (id: number) =>
        axiosInstance.delete(getVacationByIdEndpoint(id)),

    
    addLike: (vacationId: number) =>
        axiosInstance.post(getVacationLikeEndpoint(vacationId)),

    
    removeLike: (vacationId: number) =>
        axiosInstance.delete(getVacationLikeEndpoint(vacationId)),
};
