

import { Router } from "express";
import { recommendationsController } from "../controllers/recommendations-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";

const recommendationsRouter = Router();


recommendationsRouter.post('/', authMiddleware, recommendationsController.generateTravelRecommendation);

export default recommendationsRouter;
