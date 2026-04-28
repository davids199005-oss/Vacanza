

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

function initToken(_currentState: string | null, action: PayloadAction<string>): string {
    
    return action.payload;
}

function logoutToken(): null {
    
    return null;
}

export const tokenSlice = createSlice({
    name: "token-slice",
    initialState: null as string | null,
    reducers: { initToken, logoutToken },
});
