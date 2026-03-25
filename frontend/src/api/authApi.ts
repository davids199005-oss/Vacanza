/**
 * @fileoverview Auth API client (login, register).
 * Layer: API — authentication endpoints.
 * Notes:
 * - Methods return typed Axios promises for strict callsites.
 */

import axiosInstance from "./axiosInstance";
import { AuthResponse, LoginData, RegisterData } from "../models/user";
import { API_ENDPOINTS } from "../config/appConfig";

export const authApi = {
    // Create user account and return JWT.
    register: (data: RegisterData) =>
        axiosInstance.post<AuthResponse>(API_ENDPOINTS.authRegister, data),

    // Authenticate and return JWT.
    login: (data: LoginData) =>
        axiosInstance.post<AuthResponse>(API_ENDPOINTS.authLogin, data),
};
