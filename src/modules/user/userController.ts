import { Response, NextFunction } from 'express';
import * as userService from './userService';
import * as userRepo from './userRepository'; // <-- Added to call the new stats function
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';

export const getLeaderboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const leaderboard = await userService.fetchLeaderboard();
    return successResponse(res, 200, 'Global Leaderboard fetched successfully', leaderboard);
  } catch (error) {
    next(error);
  }
};

export const getMyStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.userId;
    if (!citizenId) {
      return errorResponse(res, 401, 'Unauthorized');
    }

    const stats = await userRepo.getUserStats(citizenId);
    return successResponse(res, 200, 'User stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};