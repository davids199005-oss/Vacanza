/**
 * @fileoverview Контроллер AI-рекомендаций по направлению поездки.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   HTTP-обработчик POST /api/recommendations. Принимает поле destination,
 *   валидирует его и делегирует генерацию текста рекомендаций сервису.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Controller. Здесь не делается ничего, кроме нормализации входа
 *   и сериализации результата в JSON.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Парсит body Zod-схемой recommendationSchema.
 *   - Тримит destination перед передачей в сервис, чтобы избежать промптов
 *     из одних пробелов.
 *   - Возвращает 200 OK + { recommendation: <markdown-строка от LLM> }.
 */

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
            // Валидируем тело запроса и достаём поле destination.
            const { destination } = recommendationSchema.parse(req.body);
            // Делегируем вызов LLM сервисному слою.
            const recommendation = await recommendationsService.generateTravelRecommendation(destination.trim());
            res.status(StatusCode.OK).json({ recommendation });
        } catch (error) {
            next(error);
        }
    }
}

export const recommendationsController = new RecommendationsController();
