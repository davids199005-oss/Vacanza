/**
 * @fileoverview Users routes: profile, avatar, password, liked vacations.
 * Layer: Route — all routes require authMiddleware.
 * Notes:
 * - `authMiddleware` must run before any controller to populate `req.user`.
 * - Avatar upload uses multer middleware before controller logic.
 */

import { Router } from "express";
import { usersController } from "../controllers/users-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { uploadAvatar } from "../utils/multer-util.ts";

const usersRouter = Router();

// Get current authenticated user profile.
usersRouter.get("/me", authMiddleware, usersController.getProfile);
// Update firstName/lastName/email and return refreshed JWT.
usersRouter.put("/me", authMiddleware, usersController.updateProfile);
// Upload and update user avatar file.
usersRouter.patch("/me/avatar", authMiddleware, uploadAvatar, usersController.updateAvatar);
// Change current password after validating currentPassword.
usersRouter.patch("/me/password", authMiddleware, usersController.changePassword);
// Get vacations liked by current user.
usersRouter.get("/me/likes", authMiddleware, usersController.getLikedVacations);
// Delete current user account and related assets.
usersRouter.delete("/me", authMiddleware, usersController.deleteAccount);

export default usersRouter;