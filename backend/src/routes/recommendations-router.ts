/**
 * @fileoverview Роут AI-рекомендаций.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Подключает единственный защищённый эндпоинт POST /api/recommendations,
 *   через который пользователь запрашивает совет от LLM по выбранному направлению.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Route. Сам по себе только связывает URL с обработчиком и навешивает
 *   authMiddleware. Дополнительный rate-limit (`recommendationsRateLimit`)
 *   подключается в server.ts на уровне выше — чтобы защитить дорогостоящий
 *   AI-вызов.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - POST / — генерация рекомендаций (метод POST выбран потому, что
 *     destination передаётся в теле запроса).
 */

import { Router } from "express";
import { recommendationsController } from "../controllers/recommendations-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";

const recommendationsRouter = Router();

// Сгенерировать AI-рекомендацию для указанного направления.
recommendationsRouter.post('/', authMiddleware, recommendationsController.generateTravelRecommendation);

export default recommendationsRouter;
