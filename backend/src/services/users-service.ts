/**
 * @fileoverview Сервис управления профилем и аккаунтом пользователя.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Реализует операции пользователя над собственным аккаунтом:
 *     - получить профиль;
 *     - обновить профиль (имя/фамилия/email);
 *     - обновить аватар;
 *     - сменить пароль;
 *     - удалить аккаунт;
 *     - получить список лайкнутых вакаций.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Service. Используется users-controller. Все операции инкапсулируют
 *   доступ к БД и работу с файлами на диске (старые аватары удаляются).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - При смене email возвращает новый JWT — токен «носит» имя/email/role,
 *     поэтому после изменения профиля старый payload устаревает.
 *   - При обновлении аватара удаляет файл прежнего аватара с диска.
 *   - При удалении аккаунта чистит и БД-запись, и файл аватара.
 *   - Использует bcrypt.compare для проверки текущего пароля при смене.
 */

import { db } from "../configs/db-config.ts";
import { NotFoundError, UnauthorizedError, ConflictError } from "../errors/base-errors.ts";
import { UpdateProfileSchema, ChangePasswordSchema } from "../schemas/users-schema.ts";
import { mapUser, RawUser } from "../utils/map-users-util.ts";
import { IUser } from "../models/users-model.ts";
import { generateToken } from "../utils/jwt-util.ts";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";
import { VacationWithLikes } from "../models/vacations-model.ts";
import { RawVacation, mapVacation } from "../utils/map-vacations-util.ts";
import fs from "fs/promises";
import path from "path";

class UserService {

    /** Возвращает профиль пользователя по id. */
    public async getProfile(userId: number): Promise<IUser> {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE id = ?", [userId]
        );
        const raw = (rows as RawUser[])[0];
        if (!raw) throw new NotFoundError("User not found");
        return mapUser(raw);
    }


    /** Обновляет профиль (firstName/lastName/email) и возвращает обновлённый JWT. */
    public async updateProfile(userId: number, dto: UpdateProfileSchema): Promise<string> {
        // Проверяем уникальность email, исключая самого пользователя.
        const [existing] = await db.execute(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            [dto.email, userId]
        );
        if ((existing as { id: number }[]).length > 0) {
            throw new ConflictError("Email already exists");
        }

        await db.execute(`
            UPDATE users
            SET first_name = ?, last_name = ?, email = ?
            WHERE id = ?
        `, [dto.firstName, dto.lastName, dto.email, userId]);

        const [rows] = await db.execute(
            "SELECT * FROM users WHERE id = ?", [userId]
        );
        const raw = (rows as RawUser[])[0];
        if (!raw) throw new NotFoundError("User not found");
        // Возвращаем новый токен, чтобы фронтенд получил актуальные claims профиля.
        return generateToken(mapUser(raw));
    }

    /** Сохраняет имя файла нового аватара и удаляет старый файл с диска. */
    public async updateAvatar(userId: number, avatarName: string): Promise<string> {
        // Сначала читаем имя предыдущего файла, чтобы не оставить его «осиротевшим» на диске.
        const [oldRows] = await db.execute(
            "SELECT avatar FROM users WHERE id = ?", [userId]
        );
        const existing = (oldRows as { avatar: string | null }[])[0];

        await db.execute(
            "UPDATE users SET avatar = ? WHERE id = ?",
            [avatarName, userId]
        );

        if (existing?.avatar) {
            const oldPath = path.join(process.cwd(), "assets/images/avatars", existing.avatar);
            await fs.unlink(oldPath).catch(() => {}); // Игнорируем ошибку, если файла уже нет.
        }

        return avatarName;
    }

    /** Меняет пароль после проверки текущего. */
    public async changePassword(userId: number, dto: ChangePasswordSchema): Promise<void> {
        // Сначала верифицируем текущий пароль — иначе любой, у кого есть токен,
        // мог бы сменить пароль украденному аккаунту.
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE id = ?", [userId]
        );
        const raw = (rows as RawUser[])[0];
        if (!raw) throw new NotFoundError("User not found");

        const user = mapUser(raw);
        const isValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isValid) throw new UnauthorizedError("Current password is incorrect");

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await db.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, userId]
        );
    }

    /** Удаляет аккаунт пользователя и связанный файл аватара. */
    public async deleteAccount(userId: number): Promise<void> {
        const [avatarRows] = await db.execute(
            "SELECT avatar FROM users WHERE id = ?", [userId]
        );
        const existing = (avatarRows as { avatar: string | null }[])[0];

        const [result] = await db.execute(
            "DELETE FROM users WHERE id = ?", [userId]
        );
        if ((result as ResultSetHeader).affectedRows === 0) {
            throw new NotFoundError("User not found");
        }

        if (existing?.avatar) {
            const oldPath = path.join(process.cwd(), "assets/images/avatars", existing.avatar);
            await fs.unlink(oldPath).catch(() => {}); // Игнорируем, если файла уже нет.
        }
    }

    /** Возвращает список вакаций, лайкнутых пользователем (INNER JOIN на likes). */
    public async getLikedVacations(userId: number): Promise<VacationWithLikes[]> {
        // INNER JOIN на likes гарантирует, что в результат попадут только лайкнутые
        // вакации; LEFT JOIN на ту же таблицу — для подсчёта общего числа лайков.
        const [rows] = await db.execute(`
            SELECT
                v.id,
                v.destination,
                v.description,
                v.start_date AS startDate,
                v.end_date AS endDate,
                v.price,
                v.image,
                COUNT(l2.user_id) as likes,
                1 as isLiked
            FROM vacations v
            INNER JOIN likes l ON v.id = l.vacation_id AND l.user_id = ?
            LEFT JOIN likes l2 ON v.id = l2.vacation_id
            GROUP BY v.id
            ORDER BY v.start_date ASC
        `, [userId]);
        return (rows as RawVacation[]).map(mapVacation);
    }
}

export const userService = new UserService();
