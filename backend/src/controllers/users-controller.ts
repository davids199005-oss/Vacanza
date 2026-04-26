/**
 * @fileoverview Контроллер пользователя: профиль, аватар, пароль, лайки.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   HTTP-обработчики приватных эндпоинтов /api/users/* . Все методы
 *   требуют, чтобы выше по цепочке отработал authMiddleware (заполнил req.user).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Controller. Делегирует доменную логику userService и приводит
 *   её результаты к корректному HTTP-ответу.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ (по методам):
 *   - getProfile        — отдаёт профиль текущего пользователя БЕЗ password.
 *   - updateProfile     — валидирует обновлённые поля, сохраняет в БД,
 *                          возвращает обновлённый JWT (так как payload
 *                          мог измениться: имя/email).
 *   - updateAvatar      — принимает файл от multer (поле "avatar"),
 *                          возвращает новое имя файла. Если файл не загружен,
 *                          бросает BadRequestError.
 *   - changePassword    — валидирует current/new/confirm и обновляет пароль.
 *                          Возвращает 204 No Content.
 *   - getLikedVacations — отдаёт список лайкнутых пользователем вакаций.
 *   - deleteAccount     — удаляет аккаунт + аватар, возвращает 204.
 */

import { Request, Response, NextFunction } from "express";
import { userService } from "../services/users-service.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { updateProfileSchema, changePasswordSchema } from "../schemas/users-schema.ts";
import { BadRequestError } from "../errors/base-errors.ts";

class UsersController {

    constructor() {
        // Все обработчики передаются в роутер по ссылке — bind фиксирует this.
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.getLikedVacations = this.getLikedVacations.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Идентификатор берём из payload токена (положил authMiddleware).
            const userId = req.user!.id;
            const user = await userService.getProfile(userId);
            // Никогда не возвращаем хеш пароля в ответе API.
            const { password, ...profile } = user;
            res.status(StatusCode.OK).json(profile);
        } catch (error) {
            next(error);
        }
    }

    public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            // Валидируем payload firstName/lastName/email.
            const dto = updateProfileSchema.parse(req.body);
            // Сервис возвращает свежий JWT с обновлёнными claims.
            const token = await userService.updateProfile(userId, dto);
            res.status(StatusCode.OK).json({ token });
        } catch (error) {
            next(error);
        }
    }

    public async updateAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Multer должен был положить файл в req.file. Если нет — это ошибка клиента.
            if (!req.file) {
                throw new BadRequestError("Avatar image is required");
            }
            const userId = req.user!.id;
            const avatarName = req.file.filename;
            // Сервис сохранит имя файла в БД и удалит предыдущий файл с диска.
            await userService.updateAvatar(userId, avatarName);
            res.status(StatusCode.OK).json({ avatar: avatarName });
        } catch (error) {
            next(error);
        }
    }

    public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            // Валидируем payload current/new/confirm пароля.
            const dto = changePasswordSchema.parse(req.body);
            await userService.changePassword(userId, dto);
            // 204 — операция прошла успешно, тела ответа не требуется.
            res.status(StatusCode.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
    }

    public async getLikedVacations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            // Возвращаем только те вакации, которые лайкнул текущий пользователь.
            const vacations = await userService.getLikedVacations(userId);
            res.status(StatusCode.OK).json(vacations);
        } catch (error) {
            next(error);
        }
    }

    public async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            // Сервис удалит запись из БД и связанный файл аватара.
            await userService.deleteAccount(userId);
            res.status(StatusCode.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
    }
}

export const usersController = new UsersController();
