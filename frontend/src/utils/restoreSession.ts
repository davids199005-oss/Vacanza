/**
 * @fileoverview Восстановление пользовательской сессии при старте приложения.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   На старте SPA читает токен из localStorage, декодирует его и
 *   гидратирует Redux-state (token + user). Это позволяет пользователю
 *   оставаться залогиненным между перезагрузками страницы.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util (фронт). Вызывается из main.tsx сразу после создания store
 *   и до рендера App.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   1. Берёт значение TOKEN_STORAGE_KEY из localStorage.
 *   2. Если токена нет — выходит (нечего восстанавливать).
 *   3. Если есть — пытается распарсить через jwtDecode.
 *      • Успех  → диспатчит initToken(token) и initUser(user).
 *      • Ошибка → удаляет невалидный/просроченный токен из localStorage.
 */

import { Store } from "@reduxjs/toolkit";
import { tokenSlice } from "../redux/TokenSlice";
import { userSlice } from "../redux/UserSlice";
import { jwtDecode } from "./jwtDecode";
import { TOKEN_STORAGE_KEY } from "../config/appConfig";

/**
 * Читает токен из localStorage, декодирует его и инициализирует Redux.
 */
export function restoreSession(store: Store): void {
    // Получаем сохранённый JWT.
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    // Раннее завершение: если токена нет, восстанавливать нечего.
    if (!token) return;

    try {
        // Декодируем payload и формируем IUser для слайса.
        const user = jwtDecode(token);
        // Гидратация: возвращаем auth-состояние в Redux.
        store.dispatch(tokenSlice.actions.initToken(token));
        store.dispatch(userSlice.actions.initUser(user));
    } catch {
        // Удаляем невалидный/просроченный токен — лучше потребовать перелогин.
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
}
