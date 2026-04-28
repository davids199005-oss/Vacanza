

export const Role: Record<string, string> = {
    
    USER: "user",
    
    ADMIN: "admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
