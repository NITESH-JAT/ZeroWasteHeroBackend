//src/modules/user/userController.ts
import { Response, NextFunction } from 'express';
import * as userService from './userService';
import * as userRepo from './userRepository'; // <-- Added to call the new stats function
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';

export const getLeaderboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {

    const users = await userRepo.getTopUsersByPoints();
    return successResponse(res, 200, 'Leaderboard fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

export const getMyStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role; // Ensure your auth middleware attaches the role!
    if (!userId || !role) return errorResponse(res, 401, 'Unauthorized');

    const stats = await userRepo.getUserStats(userId, role);
    return successResponse(res, 200, 'User stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};