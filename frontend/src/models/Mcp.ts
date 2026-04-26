/**
 * @fileoverview DTO-типы для MCP-чата и AI-рекомендаций.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает интерфейсы запросов и ответов для двух AI-эндпоинтов backend:
 *     - /api/mcp/ask          (Q&A через MCP-инструменты);
 *     - /api/recommendations  (генерация совета по направлению).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Models. Используется API-клиентами и страницами для типизации
 *   запросов/ответов и предотвращения опечаток в полях.
 */

export interface McpQuestion {
    // Вопрос пользователя к MCP-ассистенту.
    question: string;
}

export interface McpResponse {
    // Текстовый ответ ассистента.
    answer: string;
}

export interface RecommendationRequest {
    // Направление, по которому пользователь просит совет.
    destination: string;
}

export interface RecommendationResponse {
    // Сгенерированный markdown-текст рекомендации.
    recommendation: string;
}
