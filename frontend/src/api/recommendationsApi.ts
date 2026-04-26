/**
 * @fileoverview API-клиент AI-рекомендаций по поездкам.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Отправляет название направления на /api/recommendations и возвращает
 *   сгенерированный LLM текст-совет (markdown).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой API-клиента. Используется страницей Recommendations.
 */

import axiosInstance from "./axiosInstance";
import { RecommendationResponse } from "../models/Mcp";
import { API_ENDPOINTS } from "../config/appConfig";

export const recommendationsApi = {
    // Отправляем направление и получаем рекомендацию в виде markdown-строки.
    generate: (destination: string) =>
        axiosInstance.post<RecommendationResponse>(API_ENDPOINTS.recommendations, { destination }),
};
