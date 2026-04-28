

import { Router } from "express";
import { usersController } from "../controllers/users-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { uploadAvatar } from "../utils/multer-util.ts";

const usersRouter = Router();


usersRouter.get("/me", authMiddleware, usersController.getProfile);

usersRouter.put("/me", authMiddleware, usersController.updateProfile);

usersRouter.patch("/me/avatar", authMiddleware, uploadAvatar, usersController.updateAvatar);

usersRouter.patch("/me/password", authMiddleware, usersController.changePassword);

usersRouter.get("/me/likes", authMiddleware, usersController.getLikedVacations);

usersRouter.delete("/me", authMiddleware, usersController.deleteAccount);

export default usersRouter;
