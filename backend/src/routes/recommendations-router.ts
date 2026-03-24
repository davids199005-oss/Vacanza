/**
 * @fileoverview Recommendations routes: AI travel advice.
 * Layer: Route — auth required; rate-limited via recommendationsRateLimit in server.
 * Notes:
 * - Endpoint is intentionally POST because it accepts request body payload.
 */

import { Router } from "express";
import { recommendationsController } from "../controllers/recommendations-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";

const recommendationsRouter = Router();

// Generate AI recommendation for provided destination.
recommendationsRouter.post('/', authMiddleware, recommendationsController.generateTravelRecommendation);

export default recommendationsRouter;