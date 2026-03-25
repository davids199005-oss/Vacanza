/**
 * @fileoverview Redux slice for vacations list state.
 * Layer: State — vacations cache with like toggle and delete.
 * Notes:
 * - Performs local optimistic state updates for like/delete actions.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationWithLikes } from "../models/vacation";

function initVacations(_currentState: VacationWithLikes[], action: PayloadAction<VacationWithLikes[]>): VacationWithLikes[] {
    // Replace full vacations collection after fetch.
    const newState = action.payload;
    return newState;
}

function toggleLike(currentState: VacationWithLikes[], action: PayloadAction<{ vacationId: number; isLiked: boolean }>): VacationWithLikes[] {
    const { vacationId, isLiked } = action.payload;
    // Create shallow copy to keep reducer immutable.
    const newState = [...currentState];
    const index = newState.findIndex(v => v.id === vacationId);
    if (index >= 0) {
        // Update like flag and adjust likes counter in sync.
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
    // Remove deleted item from cached list.
    const newState = currentState.filter(v => v.id !== idToDelete);
    return newState;
}

function clearVacations(): VacationWithLikes[] {
    // Reset vacations state on logout or full refresh scenarios.
    return [];
}

export const vacationsSlice = createSlice({
    name: "vacations-slice",
    initialState: [] as VacationWithLikes[],
    reducers: { initVacations, toggleLike, deleteVacation, clearVacations },
});
