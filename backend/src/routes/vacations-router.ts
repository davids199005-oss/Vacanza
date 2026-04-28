

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { adminMiddleware } from "../middlewares/admin-middleware.ts";
import { uploadVacationImage } from "../utils/multer-util.ts";
import { vacationsController } from "../controllers/vacations-controller.ts";

const vacationsRouter = Router();


vacationsRouter.get('/', authMiddleware, vacationsController.getAllVacations);

vacationsRouter.post('/', authMiddleware, adminMiddleware, uploadVacationImage, vacationsController.addVacation);

vacationsRouter.put('/:id', authMiddleware, adminMiddleware, uploadVacationImage, vacationsController.updateVacation);

vacationsRouter.delete('/:id', authMiddleware, adminMiddleware, vacationsController.deleteVacation);

vacationsRouter.post('/:vacationId/likes', authMiddleware, vacationsController.addLike);

vacationsRouter.delete('/:vacationId/likes', authMiddleware, vacationsController.removeLike);
export default vacationsRouter;
