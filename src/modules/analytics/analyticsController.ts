import { Response, NextFunction } from 'express';
import * as analyticsService from './analyticsService';
import { successResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';

export const getSystemAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await analyticsService.fetchSystemDashboard();
    return successResponse(res, 200, 'System analytics fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};