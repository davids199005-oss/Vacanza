

import { Request, Response, NextFunction } from "express";
import { vacationsService } from "../services/vacations-service.ts";
import { addVacationSchema, updateVacationSchema } from "../schemas/vacations-schema.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { BadRequestError } from "../errors/base-errors.ts";
import { idParamsSchema } from "../schemas/params-schema.ts";

class VacationsController {
    constructor() {

        
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
            
            const vacations = await vacationsService.getAllVacations(userId);
            res.status(StatusCode.OK).json(vacations);
        } catch (error) {
            next(error);
        }
    }

    public async addVacation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            if (!req.file) {
                throw new BadRequestError("Image is required");
            }
            const imageName = req.file.filename;
            
            const dto = addVacationSchema.parse(req.body);
            const vacation = await vacationsService.addVacation(dto, imageName);
            res.status(StatusCode.CREATED).json(vacation);
        } catch (error) {
            next(error);
        }
    }

    public async updateVacation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const id = idParamsSchema.parse(req.params.id);
            
            const imageName = req.file?.filename;
            
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
            
            await vacationsService.removeLike(userId, vacationId);
            res.status(StatusCode.OK).send();
        } catch (error) {
            next(error);
        }
    }
}

export const vacationsController = new VacationsController();
