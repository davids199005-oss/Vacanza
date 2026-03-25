/**
 * @fileoverview AI recommendations API client.
 * Layer: API — AI-powered travel recommendation endpoint.
 * Notes:
 * - Destination string is sent in request body.
 */

import axiosInstance from "./axiosInstance";
import { RecommendationResponse } from "../models/mcp";
import { API_ENDPOINTS } from "../config/appConfig";

export const recommendationsApi = {
    // Generate recommendation text for destination.
    generate: (destination: string) =>
        axiosInstance.post<RecommendationResponse>(API_ENDPOINTS.recommendations, { destination }),
};
