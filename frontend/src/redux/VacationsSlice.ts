

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationWithLikes } from "../models/Vacation";

function initVacations(_currentState: VacationWithLikes[], action: PayloadAction<VacationWithLikes[]>): VacationWithLikes[] {
    
    const newState = action.payload;
    return newState;
}

function toggleLike(currentState: VacationWithLikes[], action: PayloadAction<{ vacationId: number; isLiked: boolean }>): VacationWithLikes[] {
    const { vacationId, isLiked } = action.payload;
    
    const newState = [...currentState];
    const index = newState.findIndex(v => v.id === vacationId);
    if (index >= 0) {
        
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
    
    const newState = currentState.filter(v => v.id !== idToDelete);
    return newState;
}

function clearVacations(): VacationWithLikes[] {
    
    return [];
}

export const vacationsSlice = createSlice({
    name: "vacations-slice",
    initialState: [] as VacationWithLikes[],
    reducers: { initVacations, toggleLike, deleteVacation, clearVacations },
});
