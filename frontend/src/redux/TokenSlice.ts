/**
 * @fileoverview Redux-слайс для хранения JWT-токена.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Управляет одной примитивной строкой — текущим access-токеном.
 *   Все компоненты, которым нужен токен, читают его из этого слайса.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой State Management. Параллельно работает с localStorage:
 *   actual токен дублируется в localStorage, чтобы переживать перезагрузку
 *   страницы (см. utils/restoreSession).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - initToken(token)  — сохраняет токен (после login/register/restore).
 *   - logoutToken()     — сбрасывает токен в null (logout).
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

function initToken(_currentState: string | null, action: PayloadAction<string>): string {
    // Сохраняем новый токен после входа, регистрации или восстановления сессии.
    return action.payload;
}

function logoutToken(): null {
    // Очищаем токен при выходе пользователя.
    return null;
}

export const tokenSlice = createSlice({
    name: "token-slice",
    initialState: null as string | null,
    reducers: { initToken, logoutToken },
});
