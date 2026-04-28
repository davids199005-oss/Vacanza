

import { Role } from "../enums/roles-enum.ts";


export interface JwtPayload {
    
    id: number;
    
    email: string;
    
    role: Role;
    
    firstName: string;
    
    lastName: string;

}
