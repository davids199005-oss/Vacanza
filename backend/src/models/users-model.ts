

import { Role } from "../enums/roles-enum.ts";


export interface IUser {
    
    id: number;
    
    firstName: string;
    
    lastName: string;
    
    email: string;
    
    password: string;
    
    role: Role;
    
    avatar: string | null;

}


export type User = Omit<IUser, 'password'>;
