/**
 * @fileoverview Configured Axios instance for API calls.
 * Layer: API — HTTP client with JWT injection and 401 handling.
 * Notes:
 * - Central place for headers, base URL, and interceptors.
 * - Keeps auth behavior consistent across all API modules.
 */

import axios from "axios";
import { API_BASE_URL, TOKEN_STORAGE_KEY } from "../config/constants";

const axiosInstance = axios.create({
    // Base URL for all relative endpoint paths.
    baseURL: API_BASE_URL,
    headers: {
        // Default JSON content type for most requests.
        "Content-Type": "application/json",
    },
});

// Request interceptor: inject JWT from localStorage
axiosInstance.interceptors.request.use((config) => {
    // Read persisted token and attach Bearer header when present.
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: clear token on 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // On unauthorized response, clear stale local auth token.
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
