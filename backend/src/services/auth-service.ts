/**
 * @fileoverview Сервис аутентификации: регистрация и логин.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Реализует основную бизнес-логику авторизации:
 *     - register(): создание нового пользователя с проверкой уникальности email,
 *       хешированием пароля и выдачей JWT;
 *     - login():    проверка пары email/password и выдача JWT.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Service. Используется auth-controller. Сервис не знает про HTTP,
 *   контроллер обернёт его исключения в HTTP-ответ через error-handler.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Хранит пароли только в виде bcrypt-хеша (cost factor = 10).
 *   - Бросает ConflictError при попытке зарегистрироваться с занятым email.
 *   - Бросает UnauthorizedError при неверных учётных данных.
 *   - Вызывает generateToken после успешной операции и возвращает JWT.
 */

import { RegisterSchema, LoginSchema } from "../schemas/auth-schema.ts";
import { db } from "../configs/db-config.ts";
import { ConflictError, InternalServerError, UnauthorizedError } from "../errors/base-errors.ts";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt-util.ts";
import { ResultSetHeader } from "mysql2";
import { mapUser, RawUser } from "../utils/map-users-util.ts";

class AuthService {

    /** Регистрирует пользователя, хеширует пароль и возвращает JWT. */
    public async register(data: RegisterSchema): Promise<string> {
        // Шаг 1: проверяем, что email ещё не занят, до выполнения INSERT.
        const [rows] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [data.email]
        );
        if (Array.isArray(rows) && rows.length > 0) {
            throw new ConflictError('Email already exists');
        }

        // Шаг 2: бизнес-правило безопасности — в БД сохраняется только bcrypt-хеш,
        // исходный пароль никуда не сохраняется и нигде не логируется.
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
            [data.firstName, data.lastName, data.email, hashedPassword]
        );

        // Шаг 3: читаем только что созданную запись, чтобы получить «канонические»
        // значения для payload токена (id, role-default из БД и т.п.).
        const insertId = (result as ResultSetHeader).insertId;
        const [userRows] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [insertId]
        );
        const raw = (userRows as RawUser[])[0];
        if (!raw) {
            throw new InternalServerError('Failed to register user');
        }
        const user = mapUser(raw);
        return generateToken(user);
    }

    /** Проверяет учётные данные и возвращает JWT при успехе. */
    public async login(data: LoginSchema): Promise<string> {
        // Ищем пользователя по email и затем сравниваем хеш пароля.
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [data.email]
        );

        const raw = Array.isArray(rows) ? rows[0] : null;
        if (!raw) {
            // Используем одно и то же сообщение для «нет такого email» и «неверный пароль»,
            // чтобы не подсказывать атакующему, какие email существуют в БД.
            throw new UnauthorizedError('Invalid email or password');
        }
        const user = mapUser(raw as RawUser);
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }
        // Выдаём свежий access-token.
        return generateToken(user);
    }
}

export const authService = new AuthService();
