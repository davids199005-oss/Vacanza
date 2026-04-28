

import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { userSlice } from "./UserSlice";
import { tokenSlice } from "./TokenSlice";
import { vacationsSlice } from "./VacationsSlice";

export const store = configureStore<AppState>({
    reducer: {
        
        user: userSlice.reducer,
        
        token: tokenSlice.reducer,
        
        vacations: vacationsSlice.reducer,
    },
});
