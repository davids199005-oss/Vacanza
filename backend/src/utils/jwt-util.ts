

import jwt from "jsonwebtoken";
import { env } from "../configs/env-validator.ts";
import { IUser } from "../models/users-model.ts";
import { UnauthorizedError } from "../errors/base-errors.ts";
import { JwtPayload } from "../models/jwt-payload-model.ts";


export function generateToken(user: IUser): string {
  
  
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1h",
    algorithm: "HS256",
    issuer: "vacanza-api",
    audience: "vacanza-app",
  });
}


export function verifyToken(token: string): JwtPayload {
  try {
    
    return jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "vacanza-api",
      audience: "vacanza-app",
    }) as JwtPayload;
  } catch {
    
    
    throw new UnauthorizedError("Unauthorized");
  }
}
