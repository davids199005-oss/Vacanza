/**
 * @fileoverview MCP and AI recommendation request/response models.
 * Layer: Domain — DTOs for MCP chat and AI recommendation APIs.
 * Notes:
 * - Simple transport DTOs used by API client and UI pages.
 */

export interface McpQuestion {
    // User question for MCP assistant.
    question: string;
}

export interface McpResponse {
    // Assistant answer text.
    answer: string;
}

export interface RecommendationRequest {
    // Destination used by recommendation generator.
    destination: string;
}

export interface RecommendationResponse {
    // Generated recommendation text.
    recommendation: string;
}
