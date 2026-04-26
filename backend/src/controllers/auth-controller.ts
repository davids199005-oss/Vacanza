/**
 * @fileoverview Контроллер аутентификации (register / login).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   HTTP-обработчики для регистрации нового аккаунта и логина существующего.
 *   Контроллер сам не лезет в БД — он только парсит запрос Zod-схемой и
 *   делегирует работу сервису.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Controller. Связующее звено между HTTP-уровнем (express) и слоем
 *   Service. Все ошибки прокидываются в `next(error)` для централизованной
 *   обработки в errorHandlerMiddleware.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - register: парсит body через registerSchema, вызывает authService.register,
 *     возвращает 201 Created + { token }.
 *   - login:    парсит body через loginSchema, вызывает authService.login,
 *     возвращает 200 OK + { token }.
 *   - В конструкторе bind методов фиксирует контекст this — это нужно,
 *     потому что они передаются в роутер по ссылке и без bind теряют this.
 */

import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../schemas/auth-schema.ts";
import { authService } from "../services/auth-service.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";



class AuthController {
    constructor() {
        // bind фиксирует контекст this, чтобы методы можно было передать как
        // обработчики роута без потери ссылки на экземпляр класса.
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    // Регистрирует новый аккаунт и возвращает access-токен.
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Валидация и нормализация тела запроса.
            const data = registerSchema.parse(req.body);
            // Делегируем создание аккаунта и выдачу токена сервису.
            const token = await authService.register(data);
            // Возвращаем токен — фронтенд сразу авторизует пользователя.
            res.status(StatusCode.CREATED).json({ token });
        } catch (error) {
            // Любую ошибку отдаём централизованному error-handler.
            next(error);
        }
    }

    // Аутентифицирует пользователя и возвращает access-токен.
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Валидируем payload учётных данных.
            const data = loginSchema.parse(req.body);
            // Делегируем проверку и выдачу токена сервису.
            const token = await authService.login(data);
            res.status(StatusCode.OK).json({ token });
        } catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();
