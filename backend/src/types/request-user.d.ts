/**
 * @fileoverview Express Request augmentation: adds optional user from JWT.
 * Layer: Type — extends Express.Request with req.user.
 * Notes:
 * - `req.user` is populated by `authMiddleware` after token verification.
 * - Optional because not every route uses authentication.
 */

declare global {
  namespace Express {
    interface Request {
      // Decoded JWT payload for authenticated requests.
      user?: import('../models/jwt-payload-model.ts').JwtPayload;
    }
  }
}
export {};