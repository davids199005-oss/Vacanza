

import { Request, Response, NextFunction } from "express";
import { recommendationsService } from "../services/recommendations-service.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { recommendationSchema } from "../schemas/recommendations-schema.ts";

class RecommendationsController {
    constructor() {
        this.generateTravelRecommendation = this.generateTravelRecommendation.bind(this);
    }

    public async generateTravelRecommendation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const { destination } = recommendationSchema.parse(req.body);
            
            const recommendation = await recommendationsService.generateTravelRecommendation(destination.trim());
            res.status(StatusCode.OK).json({ recommendation });
        } catch (error) {
            next(error);
        }
    }
}

export const recommendationsController = new RecommendationsController();
