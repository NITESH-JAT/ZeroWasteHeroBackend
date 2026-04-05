import { Response, NextFunction } from 'express';
import * as userService from './userService';
import { successResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';

export const getLeaderboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const leaderboard = await userService.fetchLeaderboard();
    return successResponse(res, 200, 'Global Leaderboard fetched successfully', leaderboard);
  } catch (error) {
    next(error);
  }
};