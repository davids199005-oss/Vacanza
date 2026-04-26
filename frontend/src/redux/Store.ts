/**
 * @fileoverview Конфигурация корневого Redux Store.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Создаёт configureStore с типом AppState и подключает три slice-редьюсера:
 *   user, token, vacations. Это «точка сборки» state-слоя.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой State Management. Экспортируемый `store` подключается через
 *   <Provider> в `main.tsx`, после чего доступен всему дереву компонентов.
 */

import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { userSlice } from "./UserSlice";
import { tokenSlice } from "./TokenSlice";
import { vacationsSlice } from "./VacationsSlice";

export const store = configureStore<AppState>({
    reducer: {
        // Состояние профиля текущего авторизованного пользователя.
        user: userSlice.reducer,
        // Состояние access-токена (JWT).
        token: tokenSlice.reducer,
        // Кеш списка вакаций и локальные обновления like/delete.
        vacations: vacationsSlice.reducer,
    },
});
