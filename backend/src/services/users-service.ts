

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

    
    public async getProfile(userId: number): Promise<IUser> {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE id = ?", [userId]
        );
        const raw = (rows as RawUser[])[0];
        if (!raw) throw new NotFoundError("User not found");
        return mapUser(raw);
    }


    
    public async updateProfile(userId: number, dto: UpdateProfileSchema): Promise<string> {
        
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
        
        return generateToken(mapUser(raw));
    }

    
    public async updateAvatar(userId: number, avatarName: string): Promise<string> {
        
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
            await fs.unlink(oldPath).catch(() => {}); 
        }

        return avatarName;
    }

    
    public async changePassword(userId: number, dto: ChangePasswordSchema): Promise<void> {
        
        
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
            await fs.unlink(oldPath).catch(() => {}); 
        }
    }

    
    public async getLikedVacations(userId: number): Promise<VacationWithLikes[]> {
        
        
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
