/**
 * @fileoverview JWT generation and verification utilities.
 * Layer: Util — token creation and validation for auth middleware.
 * Notes:
 * - Uses shared issuer/audience constraints for stronger verification.
 * - Returns typed payload shape used in `req.user`.
 */

import jwt from "jsonwebtoken";
import { env } from "../configs/env-validator.ts";
import { IUser } from "../models/users-model.ts";
import { UnauthorizedError } from "../errors/base-errors.ts";
import { JwtPayload } from "../models/jwt-payload-model.ts";

/** Creates a signed JWT from user data; 1d expiry, HS256. */
export function generateToken(user: IUser): string {
  // Build minimal payload required by frontend + RBAC.
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  // Sign token with shared secret and constrained metadata.
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1h",          
    algorithm: "HS256",       
    issuer: "vacanza-api",    
    audience: "vacanza-app",  
  });
}

/** Verifies JWT and returns payload; throws UnauthorizedError on invalid/expired. */
export function verifyToken(token: string): JwtPayload {
  try {
    // Validate signature + algorithm + issuer + audience.
    return jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],    
      issuer: "vacanza-api",
      audience: "vacanza-app",
    }) as JwtPayload;
  } catch {
    // Hide underlying JWT parser errors behind consistent domain error.
    throw new UnauthorizedError("Unauthorized");
  }
}