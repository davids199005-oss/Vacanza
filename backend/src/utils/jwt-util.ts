/**
 * @fileoverview Утилиты подписи и верификации JWT.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Реализует две функции — `generateToken` (создание подписанного токена)
 *   и `verifyToken` (валидация токена с возвратом payload). Использует
 *   общий секрет из переменных окружения и единые ограничения issuer/audience.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util / безопасность. Используется в:
 *     - auth-service при логине/регистрации (генерация токена);
 *     - auth-middleware при проверке входящих запросов.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - generateToken(user) — подписывает JWT с минимальным набором полей
 *     (id, email, role, имя/фамилия), сроком жизни 1 час и алгоритмом HS256.
 *   - verifyToken(token)  — проверяет подпись и метаданные токена.
 *     При любой ошибке (просрочка, неверная подпись и т.п.) пробрасывает
 *     `UnauthorizedError`, чтобы скрыть детали парсера.
 *
 *   Issuer/audience задают «контекст» токена:
 *     - issuer = "vacanza-api"  — кто выпустил;
 *     - audience = "vacanza-app" — для какого клиента.
 *   Это снижает риск подмены токена из чужого сервиса.
 */

import jwt from "jsonwebtoken";
import { env } from "../configs/env-validator.ts";
import { IUser } from "../models/users-model.ts";
import { UnauthorizedError } from "../errors/base-errors.ts";
import { JwtPayload } from "../models/jwt-payload-model.ts";

/** Создаёт подписанный JWT из данных пользователя; срок жизни 1 час, HS256. */
export function generateToken(user: IUser): string {
  // Безопасность: включаем только минимально необходимые поля для UI и RBAC.
  // Никаких паролей или секретов в payload не попадает.
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  // Подписываем токен общим секретом и фиксируем метаданные.
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1h",
    algorithm: "HS256",
    issuer: "vacanza-api",
    audience: "vacanza-app",
  });
}

/** Проверяет JWT и возвращает payload; бросает UnauthorizedError при ошибке. */
export function verifyToken(token: string): JwtPayload {
  try {
    // Проверяем подпись, алгоритм, issuer и audience — все одновременно.
    return jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "vacanza-api",
      audience: "vacanza-app",
    }) as JwtPayload;
  } catch {
    // Прячем детальные ошибки парсера за единым доменным исключением,
    // чтобы клиент не получал подсказок о причине невалидности токена.
    throw new UnauthorizedError("Unauthorized");
  }
}
