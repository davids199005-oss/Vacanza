/**
 * @fileoverview Маппинг user-строк из БД в доменную модель IUser.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   В таблице БД колонки именуются в snake_case (`first_name`, `last_name`),
 *   а в коде приложения принят camelCase. Этот файл инкапсулирует
 *   единое преобразование, чтобы его не приходилось дублировать в каждом сервисе.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util. Используется в users-service и auth-service сразу после
 *   получения rows[] из mysql2.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - RawUser    — описывает «сырое» представление строки из БД.
 *   - mapUser()  — конвертирует RawUser → IUser, переводя имена полей
 *                   в camelCase. Прочие поля копируются as-is.
 */

import { IUser } from '../models/users-model.ts';
import { Role } from '../enums/roles-enum.ts';

/** Сырое представление строки из таблицы users (snake_case-колонки). */
export interface RawUser {
  // Первичный ключ.
  id: number;
  // Колонка БД: first_name.
  first_name: string;
  // Колонка БД: last_name.
  last_name: string;
  // Уникальный email пользователя.
  email: string;
  // Хеш пароля из БД.
  password: string;
  // Значение роли (`user` | `admin`).
  role: Role;
  // Имя файла аватара или null.
  avatar: string | null;
}

/** Преобразует строку БД в IUser; переводит first_name/last_name в camelCase. */
export function mapUser(row: RawUser): IUser {
  // Конвертируем соглашение БД в соглашение API/сервисного слоя.
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
