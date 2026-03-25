/**
 * @fileoverview Redux store configuration.
 * Layer: State — root store with user, token, vacations slices.
 * Notes:
 * - Root reducer keys define the shape of `AppState`.
 */

import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./appState";
import { userSlice } from "./userSlice";
import { tokenSlice } from "./tokenSlice";
import { vacationsSlice } from "./vacationsSlice";

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