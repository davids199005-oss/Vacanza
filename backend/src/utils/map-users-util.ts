

import { IUser } from '../models/users-model.ts';
import { Role } from '../enums/roles-enum.ts';


export interface RawUser {
  
  id: number;
  
  first_name: string;
  
  last_name: string;
  
  email: string;
  
  password: string;
  
  role: Role;
  
  avatar: string | null;
}


export function mapUser(row: RawUser): IUser {
  
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    password: row.password,
    role: row.role,
    avatar: row.avatar,
  };
}
