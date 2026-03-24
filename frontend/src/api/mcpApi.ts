/**
 * @fileoverview MCP chat API client.
 * Layer: API — MCP question-answer endpoint.
 * Notes:
 * - Sends plain question text; backend returns synthesized answer.
 */

import axiosInstance from "./axiosInstance";
import { McpResponse } from "../models/Mcp";
import { API_ENDPOINTS } from "../config/constants";

export const mcpApi = {
    // Ask question against vacation data via MCP tools.
    ask: (question: string) =>
        axiosInstance.post<McpResponse>(API_ENDPOINTS.mcpAsk, { question }),
};
