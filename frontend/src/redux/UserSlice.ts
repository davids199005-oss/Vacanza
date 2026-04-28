

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models/User";

function initUser(_currentState: IUser | null, action: PayloadAction<IUser>): IUser {
    
    const newState = action.payload;
    return newState;
}

function logoutUser(): null {
    
    return null;
}

export const userSlice = createSlice({
    name: "user-slice",
    initialState: null as IUser | null,
    reducers: { initUser, logoutUser },
});
