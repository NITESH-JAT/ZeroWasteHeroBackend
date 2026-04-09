import { Response, NextFunction } from 'express';
import * as campaignService from './campaignService';
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';
import * as campaignRepo from './campaignRepository';

export const createCampaign = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ngoId = req.user!.userId; 
    const { title, description, latitude, longitude, startDate, endDate } = req.body;

    if (!title || !description || !startDate || !endDate) {
      return errorResponse(res, 400, 'Title, description, startDate, and endDate are required');
    }

    const campaign = await campaignService.launchCampaign(ngoId, {
      title, description, latitude, longitude, startDate, endDate
    });
    
    return successResponse(res, 201, 'Campaign created successfully', campaign);
  } catch (error: any) {
    if (error.message === 'End date must be after the start date' || error.message === 'Cannot start a campaign in the past') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

export const getCampaigns = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Grab GPS coordinates from the query parameters
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

    const campaigns = await campaignRepo.getActiveCampaigns(lat, lng);
    
    return successResponse(res, 200, 'Campaigns fetched successfully', campaigns);
  } catch (error) {
    next(error);
  }
};