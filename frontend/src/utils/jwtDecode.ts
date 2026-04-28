

import { IUser } from "../models/User";
import { Role } from "../models/Role";

interface JwtPayload {
    
    id: number;
    
    email: string;
    
    role: Role;
    
    firstName: string;
    
    lastName: string;
    
    exp: number;
}


export function jwtDecode(token: string): IUser {
    
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;

    
    if (payload.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
    }

    return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
        
        avatar: null,
    };
}
