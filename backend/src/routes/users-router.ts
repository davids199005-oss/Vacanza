/**
 * @fileoverview Роуты управления собственным аккаунтом пользователя.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает приватные роуты /api/users/me/* — все они работают с текущим
 *   пользователем (взятым из JWT) и поэтому требуют authMiddleware.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Route. Связывает HTTP-методы с контроллером и навешивает
 *   middleware (auth + multer для аватара).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - GET    /me          — получить профиль.
 *   - PUT    /me          — обновить профиль (firstName/lastName/email)
 *                            и получить обновлённый JWT.
 *   - PATCH  /me/avatar   — загрузить новый аватар (multer "avatar").
 *   - PATCH  /me/password — сменить пароль с проверкой текущего.
 *   - GET    /me/likes    — получить список лайкнутых вакаций.
 *   - DELETE /me          — удалить аккаунт целиком.
 */

import { Router } from "express";
import { usersController } from "../controllers/users-controller.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { uploadAvatar } from "../utils/multer-util.ts";

const usersRouter = Router();

// Получить профиль текущего пользователя.
usersRouter.get("/me", authMiddleware, usersController.getProfile);
// Обновить firstName/lastName/email и вернуть обновлённый JWT.
usersRouter.put("/me", authMiddleware, usersController.updateProfile);
// Загрузить и обновить аватар пользователя.
usersRouter.patch("/me/avatar", authMiddleware, uploadAvatar, usersController.updateAvatar);
// Сменить пароль после проверки currentPassword.
usersRouter.patch("/me/password", authMiddleware, usersController.changePassword);
// Получить список вакаций, лайкнутых текущим пользователем.
usersRouter.get("/me/likes", authMiddleware, usersController.getLikedVacations);
// Удалить аккаунт текущего пользователя и связанные ресурсы.
usersRouter.delete("/me", authMiddleware, usersController.deleteAccount);

export default usersRouter;
