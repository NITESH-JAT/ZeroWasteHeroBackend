import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/globalTypes';

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET as string;
    
    // Decode and attach to our custom AuthRequest
    const decoded = jwt.verify(token, secret) as { userId: string, role: string };
    req.user = decoded;

    next();
  } catch (error) {
    return errorResponse(res, 401, 'Unauthorized: Invalid or expired token');
  }
};