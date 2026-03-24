/**
 * @fileoverview Restores auth session from localStorage on app bootstrap.
 * Layer: Utils — auth state restore; runs before React mount.
 * Notes:
 * - Keeps app logged in across page reloads when token is valid.
 */

import { Store } from "@reduxjs/toolkit";
import { tokenSlice } from "../redux/TokenSlice";
import { userSlice } from "../redux/UserSlice";
import { jwtDecode } from "./jwtDecode";
import { TOKEN_STORAGE_KEY } from "../config/constants";

/**
 * Reads token from localStorage, decodes JWT, and hydrates Redux with user and token.
 * Clears invalid/expired token from storage on decode failure.
 */
export function restoreSession(store: Store): void {
    // Read persisted JWT from browser storage.
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    // Nothing to restore when token is absent.
    if (!token) return;

    try {
        // Decode token claims into IUser shape.
        const user = jwtDecode(token);
        // Hydrate Redux auth state.
        store.dispatch(tokenSlice.actions.initToken(token));
        store.dispatch(userSlice.actions.initUser(user));
    } catch {
        // Invalid or expired token — clear storage
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
}