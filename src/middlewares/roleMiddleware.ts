import { Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/globalTypes';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized: User not identified');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, `Forbidden: Requires one of the following roles: ${allowedRoles.join(', ')}`);
    }

    next();
  };
};