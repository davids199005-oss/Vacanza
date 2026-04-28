

import axiosInstance from "./axiosInstance";
import { AuthResponse, LoginData, RegisterData } from "../models/User";
import { API_ENDPOINTS } from "../config/appConfig";

export const authApi = {
    
    register: (data: RegisterData) =>
        axiosInstance.post<AuthResponse>(API_ENDPOINTS.authRegister, data),

    
    login: (data: LoginData) =>
        axiosInstance.post<AuthResponse>(API_ENDPOINTS.authLogin, data),
};
