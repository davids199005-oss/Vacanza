/**
 * @fileoverview Redux slice for current user state.
 * Layer: State — authenticated user in Redux.
 * Notes:
 * - Mirrors current user claims/profile used across UI and guards.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models/User";

function initUser(_currentState: IUser | null, action: PayloadAction<IUser>): IUser {
    // Replace current user with latest authenticated profile.
    const newState = action.payload;
    return newState;
}

function logoutUser(): null {
    // Clear user on logout/unauthorized.
    return null;
}

export const userSlice = createSlice({
    name: "user-slice",
    initialState: null as IUser | null,
    reducers: { initUser, logoutUser },
});
