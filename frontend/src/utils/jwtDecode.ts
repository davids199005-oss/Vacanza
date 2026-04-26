/**
 * @fileoverview Декодирование JWT и извлечение данных пользователя.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Парсит base64-сегмент payload из JWT, проверяет срок жизни и возвращает
 *   объект IUser, совместимый с Redux-слайсом userSlice.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util (фронт). Используется при логине/регистрации и при
 *   восстановлении сессии (см. restoreSession).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Разбивает токен на 3 части по точкам, берёт payload (вторую часть).
 *   - Декодирует base64 (через atob) и парсит JSON.
 *   - Сравнивает exp (Unix-секунды) с текущим временем — если просрочен,
 *     бросает Error('Token expired').
 *   - Возвращает IUser; поле avatar = null, потому что в JWT его нет —
 *     аватар догружается отдельным запросом GET /users/me.
 *
 * Безопасность: декодирование не проверяет подпись токена. Это нормально
 * для фронта — реальная проверка делается сервером при каждом запросе.
 * На клиенте мы используем JWT только для UI-стейта.
 */

import { IUser } from "../models/User";
import { Role } from "../models/Role";

interface JwtPayload {
    // Поля, которые ожидаются в payload токена.
    id: number;
    // Email пользователя.
    email: string;
    // Роль (для отображения admin-разделов в UI).
    role: Role;
    // Имя.
    firstName: string;
    // Фамилия.
    lastName: string;
    // Время истечения токена в Unix-секундах.
    exp: number;
}

/**
 * Декодирует JWT и возвращает IUser. Бросает ошибку, если токен просрочен.
 */
export function jwtDecode(token: string): IUser {
    // Берём вторую секцию токена (payload) и декодируем base64.
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;

    // Сверяем exp с текущим временем — если истёк, токен использовать нельзя.
    if (payload.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
    }

    return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
        // В JWT мы не храним аватар — он догружается через GET /users/me.
        avatar: null,
    };
}
