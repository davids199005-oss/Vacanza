/**
 * @fileoverview Users API client (profile, avatar, password, likes).
 * Layer: API — user management endpoints.
 * Notes:
 * - All requests rely on axios interceptor for auth token header.
 */

import axiosInstance from "./axiosInstance";
import { IUser, UpdateProfileData, ChangePasswordData } from "../models/user";
import { VacationWithLikes } from "../models/vacation";
import { API_ENDPOINTS } from "../config/appConfig";

export const usersApi = {
    // Fetch current user profile.
    getProfile: () =>
        axiosInstance.get<IUser>(API_ENDPOINTS.usersMe),

    // Update profile fields and receive refreshed JWT.
    updateProfile: (data: UpdateProfileData) =>
        axiosInstance.put<{ token: string }>(API_ENDPOINTS.usersMe, data),

    // Upload avatar file as multipart form-data.
    updateAvatar: (formData: FormData) =>
        axiosInstance.patch<{ avatar: string }>(API_ENDPOINTS.usersAvatar, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // Change current password.
    changePassword: (data: ChangePasswordData) =>
        axiosInstance.patch(API_ENDPOINTS.usersPassword, data),

    // Delete current account.
    deleteAccount: () =>
        axiosInstance.delete(API_ENDPOINTS.usersMe),

    // Fetch vacations liked by current user.
    getLikedVacations: () =>
        axiosInstance.get<VacationWithLikes[]>(API_ENDPOINTS.usersLikes),
};
