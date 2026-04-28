

declare global {
  namespace Express {
    interface Request {
      
      user?: import('../models/jwt-payload-model.ts').JwtPayload;
    }
  }
}
export {};
