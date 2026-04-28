

import axiosInstance from "./axiosInstance";
import { IUser, UpdateProfileData, ChangePasswordData } from "../models/User";
import { VacationWithLikes } from "../models/Vacation";
import { API_ENDPOINTS } from "../config/appConfig";

export const usersApi = {
    
    getProfile: () =>
        axiosInstance.get<IUser>(API_ENDPOINTS.usersMe),

    
    updateProfile: (data: UpdateProfileData) =>
        axiosInstance.put<{ token: string }>(API_ENDPOINTS.usersMe, data),

    
    updateAvatar: (formData: FormData) =>
        axiosInstance.patch<{ avatar: string }>(API_ENDPOINTS.usersAvatar, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    
    changePassword: (data: ChangePasswordData) =>
        axiosInstance.patch(API_ENDPOINTS.usersPassword, data),

    
    deleteAccount: () =>
        axiosInstance.delete(API_ENDPOINTS.usersMe),

    
    getLikedVacations: () =>
        axiosInstance.get<VacationWithLikes[]>(API_ENDPOINTS.usersLikes),
};
