/**
 * @fileoverview Redux-слайс списка вакаций и локальных операций над ним.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Хранит кэш всех вакаций, загруженных с сервера, и предоставляет
 *   reducers для оптимистичных обновлений: переключение лайка и удаление.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой State Management. Позволяет UI обновляться мгновенно после
 *   действий пользователя, не дожидаясь повторной загрузки списка с сервера.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - initVacations(list)              — полностью заменяет коллекцию.
 *   - toggleLike({vacationId,isLiked}) — меняет флаг и счётчик likes у одной
 *     вакации (через копию массива → иммутабельность).
 *   - deleteVacation(id)               — убирает запись из кеша по id.
 *   - clearVacations()                 — полностью очищает (например, при logout).
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationWithLikes } from "../models/Vacation";

function initVacations(_currentState: VacationWithLikes[], action: PayloadAction<VacationWithLikes[]>): VacationWithLikes[] {
    // Полностью заменяем коллекцию после загрузки с сервера.
    const newState = action.payload;
    return newState;
}

function toggleLike(currentState: VacationWithLikes[], action: PayloadAction<{ vacationId: number; isLiked: boolean }>): VacationWithLikes[] {
    const { vacationId, isLiked } = action.payload;
    // Создаём копию массива — иммутабельность важна для корректной работы Redux.
    const newState = [...currentState];
    const index = newState.findIndex(v => v.id === vacationId);
    if (index >= 0) {
        // Синхронно меняем флаг и счётчик likes, чтобы UI отразил действие сразу.
        newState[index] = {
            ...newState[index],
            isLiked,
            likes: newState[index].likes + (isLiked ? 1 : -1),
        };
    }
    return newState;
}

function deleteVacation(currentState: VacationWithLikes[], action: PayloadAction<number>): VacationWithLikes[] {
    const idToDelete = action.payload;
    // Убираем запись из кеша по id (после успешного DELETE на сервере).
    const newState = currentState.filter(v => v.id !== idToDelete);
    return newState;
}

function clearVacations(): VacationWithLikes[] {
    // Полностью очищаем состояние (например, при logout).
    return [];
}

export const vacationsSlice = createSlice({
    name: "vacations-slice",
    initialState: [] as VacationWithLikes[],
    reducers: { initVacations, toggleLike, deleteVacation, clearVacations },
});
