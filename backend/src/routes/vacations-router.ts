/**
 * @fileoverview Роуты вакаций (CRUD + лайки).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает все эндпоинты ресурса /api/vacations и распределяет права
 *   доступа: чтение и лайки доступны любому залогиненному пользователю,
 *   изменения данных — только администратору.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Route. Здесь явно собирается цепочка middleware:
 *     authMiddleware → adminMiddleware → uploadVacationImage → controller.
 *   Это даёт чёткий контроль доступа на каждом уровне.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - GET    /                    — список вакаций (любой авторизованный).
 *   - POST   /                    — создание (admin) с обязательным image.
 *   - PUT    /:id                 — обновление (admin), image опционален.
 *   - DELETE /:id                 — удаление (admin).
 *   - POST   /:vacationId/likes   — поставить лайк (любой авторизованный).
 *   - DELETE /:vacationId/likes   — снять лайк (любой авторизованный).
 */

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { adminMiddleware } from "../middlewares/admin-middleware.ts";
import { uploadVacationImage } from "../utils/multer-util.ts";
import { vacationsController } from "../controllers/vacations-controller.ts";

const vacationsRouter = Router();
// Роуты сгруппированы по ресурсу vacations; доступ контролируется цепочкой middleware.
// Список вакаций со статистикой лайков для текущего пользователя.
vacationsRouter.get('/', authMiddleware, vacationsController.getAllVacations);
// Создание вакации (только admin) с загрузкой изображения.
vacationsRouter.post('/', authMiddleware, adminMiddleware, uploadVacationImage, vacationsController.addVacation);
// Обновление вакации (только admin); изображение опционально.
vacationsRouter.put('/:id', authMiddleware, adminMiddleware, uploadVacationImage, vacationsController.updateVacation);
// Удаление вакации (только admin).
vacationsRouter.delete('/:id', authMiddleware, adminMiddleware, vacationsController.deleteVacation);
// Поставить лайк на выбранную вакацию от текущего пользователя.
vacationsRouter.post('/:vacationId/likes', authMiddleware, vacationsController.addLike);
// Снять лайк текущего пользователя с выбранной вакации.
vacationsRouter.delete('/:vacationId/likes', authMiddleware, vacationsController.removeLike);
export default vacationsRouter;
