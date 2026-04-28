

import { IUser } from "../models/User";
import { VacationWithLikes } from "../models/Vacation";

export type AppState = {
    
    user: IUser | null;
    
    token: string | null;
    
    vacations: VacationWithLikes[];
};
