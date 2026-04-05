import { JwtPayload } from '../modules/auth/authTypes';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}