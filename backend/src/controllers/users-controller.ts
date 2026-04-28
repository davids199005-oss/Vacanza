

import { Request, Response, NextFunction } from "express";
import { userService } from "../services/users-service.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { updateProfileSchema, changePasswordSchema } from "../schemas/users-schema.ts";
import { BadRequestError } from "../errors/base-errors.ts";

class UsersController {

    constructor() {
        
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.getLikedVacations = this.getLikedVacations.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const userId = req.user!.id;
            const user = await userService.getProfile(userId);
            
            const { password, ...profile } = user;
            res.status(StatusCode.OK).json(profile);
        } catch (error) {
            next(error);
        }
    }

    public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            
            const dto = updateProfileSchema.parse(req.body);
            
            const token = await userService.updateProfile(userId, dto);
            res.status(StatusCode.OK).json({ token });
        } catch (error) {
            next(error);
        }
    }

    public async updateAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            if (!req.file) {
                throw new BadRequestError("Avatar image is required");
            }
            const userId = req.user!.id;
            const avatarName = req.file.filename;
            
            await userService.updateAvatar(userId, avatarName);
            res.status(StatusCode.OK).json({ avatar: avatarName });
        } catch (error) {
            next(error);
        }
    }

    public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            
            const dto = changePasswordSchema.parse(req.body);
            await userService.changePassword(userId, dto);
            
            res.status(StatusCode.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
    }

    public async getLikedVacations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            
            const vacations = await userService.getLikedVacations(userId);
            res.status(StatusCode.OK).json(vacations);
        } catch (error) {
            next(error);
        }
    }

    public async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            
            await userService.deleteAccount(userId);
            res.status(StatusCode.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
    }
}

export const usersController = new UsersController();
