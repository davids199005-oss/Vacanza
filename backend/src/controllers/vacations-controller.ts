/**
 * @fileoverview Контроллер вакаций: CRUD и лайки.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   HTTP-обработчики для всех операций над вакациями. Часть из них (CRUD)
 *   требует роли admin (это контролируется в роутере), часть — обычной
 *   аутентификации (лайки, чтение списка).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Controller. Парсит входные данные через Zod, проверяет наличие
 *   файла изображения для add (он обязателен) и для update (опционален),
 *   и делегирует операции vacationsService.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ (по методам):
 *   - getAllVacations — отдаёт список вакаций с лайками и isLiked.
 *   - addVacation     — принимает файл (обязательный) + поля формы; 201 + объект.
 *   - updateVacation  — id из params; новый файл опционален; 200 + объект.
 *   - deleteVacation  — id из params; 204 No Content.
 *   - addLike         — vacationId из params; идемпотентно (INSERT IGNORE).
 *   - removeLike      — vacationId из params; «безопасно», даже если лайка не было.
 */

import { Request, Response, NextFunction } from "express";
import { vacationsService } from "../services/vacations-service.ts";
import { addVacationSchema, updateVacationSchema } from "../schemas/vacations-schema.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { BadRequestError } from "../errors/base-errors.ts";
import { idParamsSchema } from "../schemas/params-schema.ts";

class VacationsController {
    constructor() {

        // bind методов, чтобы можно было передавать их в роутер по ссылке.
        this.getAllVacations = this.getAllVacations.bind(this);
        this.addVacation = this.addVacation.bind(this);
        this.updateVacation = this.updateVacation.bind(this);
        this.deleteVacation = this.deleteVacation.bind(this);
        this.addLike = this.addLike.bind(this);
        this.removeLike = this.removeLike.bind(this);
    }

    public async getAllVacations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            // Сервис обогащает список количеством лайков и флагом isLiked для текущего user.
            const vacations = await vacationsService.getAllVacations(userId);
            res.status(StatusCode.OK).json(vacations);
        } catch (error) {
            next(error);
        }
    }

    public async addVacation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Изображение обязательно при создании новой вакации.
            if (!req.file) {
                throw new BadRequestError("Image is required");
            }
            const imageName = req.file.filename;
            // Валидируем destination/description/dates/price.
            const dto = addVacationSchema.parse(req.body);
            const vacation = await vacationsService.addVacation(dto, imageName);
            res.status(StatusCode.CREATED).json(vacation);
        } catch (error) {
            next(error);
        }
    }

    public async updateVacation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Парсим и валидируем id из URL.
            const id = idParamsSchema.parse(req.params.id);
            // При обновлении файл опционален (можно поменять только текстовые поля).
            const imageName = req.file?.filename;
            // Валидируем редактируемые поля.
            const dto = updateVacationSchema.parse(req.body);
            const vacation = await vacationsService.updateVacation(id, dto, imageName);
            res.status(StatusCode.OK).json(vacation);
        } catch (error) {
            next(error);
        }
    }

    public async deleteVacation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = idParamsSchema.parse(req.params.id);
            // Сервис удаляет и строку из БД, и связанный файл изображения.
            await vacationsService.deleteVacation(id);
            res.status(StatusCode.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
    }

    public async addLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const vacationId = idParamsSchema.parse(req.params.vacationId);
            // Операция идемпотентна — повторный лайк не вызовет ошибку.
            await vacationsService.addLike(userId, vacationId);
            res.status(StatusCode.OK).send();
        } catch (error) {
            next(error);
        }
    }

    public async removeLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const vacationId = idParamsSchema.parse(req.params.vacationId);
            // Снимаем лайк, если он был. Если его не было — ничего не сломается.
            await vacationsService.removeLike(userId, vacationId);
            res.status(StatusCode.OK).send();
        } catch (error) {
            next(error);
        }
    }
}

export const vacationsController = new VacationsController();
