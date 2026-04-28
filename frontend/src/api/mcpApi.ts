

import axiosInstance from "./axiosInstance";
import { McpResponse } from "../models/Mcp";
import { API_ENDPOINTS } from "../config/appConfig";

export const mcpApi = {
    
    ask: (question: string) =>
        axiosInstance.post<McpResponse>(API_ENDPOINTS.mcpAsk, { question }),
};
