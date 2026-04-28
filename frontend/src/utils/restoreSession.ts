

import { Store } from "@reduxjs/toolkit";
import { tokenSlice } from "../redux/TokenSlice";
import { userSlice } from "../redux/UserSlice";
import { jwtDecode } from "./jwtDecode";
import { TOKEN_STORAGE_KEY } from "../config/appConfig";


export function restoreSession(store: Store): void {
    
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    
    if (!token) return;

    try {
        
        const user = jwtDecode(token);
        
        store.dispatch(tokenSlice.actions.initToken(token));
        store.dispatch(userSlice.actions.initUser(user));
    } catch {
        
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
}
