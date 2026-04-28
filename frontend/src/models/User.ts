

import { Role } from "./Role";

export interface IUser {
    
    id: number;
    
    firstName: string;
    
    lastName: string;
    
    email: string;
    
    role: Role;
    
    avatar: string | null;
}

export interface LoginData {
    
    email: string;
    
    password: string;
}

export interface RegisterData {
    
    firstName: string;
    
    lastName: string;
    
    email: string;
    
    password: string;
}

export interface AuthResponse {
    
    token: string;
}

export interface UpdateProfileData {
    
    firstName: string;
    
    lastName: string;
    
    email: string;
}

export interface ChangePasswordData {
    
    currentPassword: string;
    
    newPassword: string;
    
    confirmPassword: string;
}
