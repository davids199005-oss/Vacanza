/**
 * @fileoverview API-клиент MCP-чата.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Делает один запрос: отправляет произвольный пользовательский вопрос на
 *   эндпоинт /api/mcp/ask и получает текстовый ответ ассистента, основанный
 *   на данных из БД (через MCP-инструменты).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой API-клиента. Используется страницей McpChat для отправки вопросов
 *   и отображения ответа в виде сообщения чата.
 */

import axiosInstance from "./axiosInstance";
import { McpResponse } from "../models/Mcp";
import { API_ENDPOINTS } from "../config/appConfig";

export const mcpApi = {
    // Отправляем вопрос ассистенту и получаем структурированный ответ.
    ask: (question: string) =>
        axiosInstance.post<McpResponse>(API_ENDPOINTS.mcpAsk, { question }),
};
