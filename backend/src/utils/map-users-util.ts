/**
 * @fileoverview Maps raw DB user rows to domain models.
 * Layer: Util — converts snake_case column names to camelCase.
 * Notes:
 * - Keeps mapping logic centralized to avoid duplication in services.
 */

import { IUser } from '../models/users-model.ts';
import { Role } from '../enums/roles-enum.ts';

/** Raw row shape from user queries (snake_case columns). */
export interface RawUser {
  // Database primary key.
  id: number;
  // DB column: first_name.
  first_name: string;
  // DB column: last_name.
  last_name: string;
  // Unique email.
  email: string;
  // Password hash from DB.
  password: string;
  // Role value (`user` | `admin`).
  role: Role;
  // Avatar file name or null.
  avatar: string | null;
}

/** Maps DB row to IUser; converts first_name/last_name to camelCase. */
export function mapUser(row: RawUser): IUser {
  // Convert DB naming convention to API/service naming convention.
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    password: row.password,
    role: row.role,
    avatar: row.avatar,
  };
}