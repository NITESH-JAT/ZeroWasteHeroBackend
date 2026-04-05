import { Request } from 'express';

// We explicitly extend the standard Express Request
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
  file?: any; // For Multer
}