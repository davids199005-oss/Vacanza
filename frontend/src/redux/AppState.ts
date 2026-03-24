/**
 * @fileoverview Redux root state type.
 * Layer: State — global app state shape.
 * Notes:
 * - Used by `useSelector` typing across components.
 */

import { IUser } from "../models/User";
import { VacationWithLikes } from "../models/Vacation";

export type AppState = {
    // Authenticated user profile (or null when logged out).
    user: IUser | null;
    // Active access token.
    token: string | null;
    // Cached vacations list with like metadata.
    vacations: VacationWithLikes[];
};
