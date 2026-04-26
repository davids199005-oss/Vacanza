/**
 * @fileoverview Общий HTTP-клиент Axios для всех API-модулей фронтенда.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Создаёт единый настроенный axios-инстанс, через который ходят все API-модули
 *   (authApi, usersApi, vacationsApi и т.д.). Здесь же установлены интерсепторы:
 *   на каждый запрос автоматически добавляется JWT-токен из localStorage,
 *   а при ответе 401 токен очищается, чтобы прервать неактуальную сессию.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой API-интеграции (фронт). Это «единственная точка», где конфигурируется
 *   общение с backend — поэтому изменение baseURL или auth-стратегии нужно делать
 *   только здесь.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Создаёт axios-инстанс с baseURL и Content-Type=application/json по умолчанию.
 *   - Request-интерсептор: читает токен из localStorage и подмешивает заголовок
 *     `Authorization: Bearer <token>` при наличии.
 *   - Response-интерсептор: при ошибке 401 очищает токен (чтобы фронт корректно
 *     обработал «вывалившуюся» сессию).
 */

import axios from "axios";
import { API_BASE_URL, TOKEN_STORAGE_KEY } from "../config/appConfig";

const axiosInstance = axios.create({
    // Базовый URL для всех относительных endpoint-путей.
    baseURL: API_BASE_URL,
    headers: {
        // Дефолтный Content-Type для JSON-запросов.
        "Content-Type": "application/json",
    },
});

// Request-интерсептор: подкладывает Bearer-токен из localStorage в каждый запрос.
axiosInstance.interceptors.request.use((config) => {
    // Подмешиваем токен туда, где пользователь уже авторизован.
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response-интерсептор: на 401 Unauthorized сбрасывает токен.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Удаляем протухший токен, чтобы не держать невалидную сессию в localStorage.
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
