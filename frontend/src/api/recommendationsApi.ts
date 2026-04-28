

import axiosInstance from "./axiosInstance";
import { RecommendationResponse } from "../models/Mcp";
import { API_ENDPOINTS } from "../config/appConfig";

export const recommendationsApi = {
    
    generate: (destination: string) =>
        axiosInstance.post<RecommendationResponse>(API_ENDPOINTS.recommendations, { destination }),
};
