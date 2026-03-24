/**
 * @fileoverview Vacations routes: CRUD, likes.
 * Layer: Route — auth required; admin required for POST/PUT/DELETE.
 * Notes:
 * - Read/list/like routes are available to authenticated users.
 * - Mutating vacation data is restricted to admins only.
 */

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { adminMiddleware } from "../middlewares/admin-middleware.ts";
import { uploadVacationImage } from "../utils/multer-util.ts";
import { vacationsController } from "../controllers/vacations-controller.ts";

const vacationsRouter = Router();
// List vacations with like stats for current user.
vacationsRouter.get('/', authMiddleware, vacationsController.getAllVacations);
// Create vacation (admin only) with image upload.
vacationsRouter.post('/', authMiddleware, adminMiddleware, uploadVacationImage, vacationsController.addVacation);
// Update vacation (admin only), image optional.
vacationsRouter.put('/:id', authMiddleware, adminMiddleware, uploadVacationImage, vacationsController.updateVacation);
// Delete vacation (admin only).
vacationsRouter.delete('/:id', authMiddleware, adminMiddleware, vacationsController.deleteVacation);
// Add like from current user to selected vacation.
vacationsRouter.post('/:vacationId/likes', authMiddleware, vacationsController.addLike);
// Remove like from current user for selected vacation.
vacationsRouter.delete('/:vacationId/likes', authMiddleware, vacationsController.removeLike);
export default vacationsRouter;