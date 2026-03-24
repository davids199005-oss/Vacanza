/**
 * @fileoverview Auth routes: register, login.
 * Layer: Route — public endpoints; rate-limited via authRateLimit in server.
 * Notes:
 * - No auth middleware here by design.
 * - Input is validated inside controller via Zod schemas.
 */

import { Router } from "express";
import { authController } from "../controllers/auth-controller.ts";

const authRouter = Router();

// Create a new user and return JWT.
authRouter.post("/register", authController.register);
// Authenticate existing user and return JWT.
authRouter.post("/login", authController.login);

export default authRouter;