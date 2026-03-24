/**
 * @fileoverview Authentication service: registration and login.
 * Layer: Service — user creation, password hashing, JWT issuance.
 * Notes:
 * - Ensures email uniqueness before insert.
 * - Returns JWT on successful register/login.
 */

import { RegisterSchema, LoginSchema } from "../schemas/auth-schema.ts";
import { db } from "../configs/db-config.ts";
import { ConflictError, InternalServerError, UnauthorizedError } from "../errors/base-errors.ts";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt-util.ts";
import { ResultSetHeader } from "mysql2";
import { mapUser, RawUser } from "../utils/map-users-util.ts";

class AuthService {

    /** Registers user, hashes password, returns JWT. */
    public async register(data: RegisterSchema): Promise<string> {
        // Ensure email is unique before insert.
        const [rows] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [data.email]
        );
        if (Array.isArray(rows) && rows.length > 0) {
            throw new ConflictError('Email already exists');
        }

        // Store only password hash.
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
            [data.firstName, data.lastName, data.email, hashedPassword]
        );

        // Read inserted user and build token payload from canonical DB row.
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

    /** Validates credentials, returns JWT on success. */
    public async login(data: LoginSchema): Promise<string> {
        // Lookup user by email, then verify password hash.
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [data.email]
        );

        const raw = Array.isArray(rows) ? rows[0] : null;
        if (!raw) {
            throw new UnauthorizedError('Invalid email or password');
        }
        const user = mapUser(raw as RawUser);
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }
        // Issue fresh access token.
        return generateToken(user);
    }
}

export const authService = new AuthService();
