import { Response, NextFunction } from 'express';
import * as ngoRepo from './ngoRepository';
import { successResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ngoId = req.user!.userId;
    const stats = await ngoRepo.getNgoStats(ngoId);
    return successResponse(res, 200, 'NGO stats fetched', stats);
  } catch (error) {
    next(error);
  }
};

export const getCampaigns = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ngoId = req.user!.userId;
    const campaigns = await ngoRepo.getMyCampaigns(ngoId);
    return successResponse(res, 200, 'NGO campaigns fetched', campaigns);
  } catch (error) {
    next(error);
  }
};