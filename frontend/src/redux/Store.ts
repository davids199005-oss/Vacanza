/**
 * @fileoverview Redux store configuration.
 * Layer: State — root store with user, token, vacations slices.
 * Notes:
 * - Root reducer keys define the shape of `AppState`.
 */

import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { userSlice } from "./UserSlice";
import { tokenSlice } from "./TokenSlice";
import { vacationsSlice } from "./VacationsSlice";

export const store = configureStore<AppState>({
    reducer: {
        // Authenticated user profile state.
        user: userSlice.reducer,
        // Raw JWT token state.
        token: tokenSlice.reducer,
        // Vacations list and optimistic like/delete updates.
        vacations: vacationsSlice.reducer,
    },
});