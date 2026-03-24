/**
 * @fileoverview Redux slice for JWT token state.
 * Layer: State — auth token persistence in Redux.
 * Notes:
 * - `null` means unauthenticated state.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

function initToken(_currentState: string | null, action: PayloadAction<string>): string {
    // Replace token with fresh value from login/register/session restore.
    return action.payload;
}

function logoutToken(): null {
    // Clear token on logout/unauthorized.
    return null;
} 

export const tokenSlice = createSlice({
    name: "token-slice",
    initialState: null as string | null,
    reducers: { initToken, logoutToken },
});
