/**
 * @fileoverview Redux-слайс текущего пользователя.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Хранит распакованный из JWT профиль текущего пользователя (или null,
 *   если пользователь не авторизован). Используется компонентами для
 *   проверки роли (admin), отображения имени и т.д.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой State Management. Источником данных служит JWT-payload —
 *   этот объект кладётся сюда после каждого получения нового токена.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - initUser(user) — сохраняет профиль (после login/register/refresh).
 *   - logoutUser()   — сбрасывает в null (logout).
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models/User";

function initUser(_currentState: IUser | null, action: PayloadAction<IUser>): IUser {
    // Сохраняем актуальные данные авторизованного пользователя.
    const newState = action.payload;
    return newState;
}

function logoutUser(): null {
    // Сбрасываем пользователя при выходе.
    return null;
}

export const userSlice = createSlice({
    name: "user-slice",
    initialState: null as IUser | null,
    reducers: { initUser, logoutUser },
});
