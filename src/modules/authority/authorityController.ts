import { Response, NextFunction } from 'express';
import * as authRepo from './authorityRepository';
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await authRepo.getCityStats();
    return successResponse(res, 200, 'City stats fetched', stats);
  } catch (error) {
    next(error);
  }
};

export const getNgos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ngos = await authRepo.getAllNGOs();
    return successResponse(res, 200, 'NGOs fetched', ngos);
  } catch (error) {
    next(error);
  }
};

export const getPenaltiesList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const penalties = await authRepo.getPenalties();
    return successResponse(res, 200, 'Penalties fetched', penalties);
  } catch (error) {
    next(error);
  }
};

export const createPenalty = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, amount, reason } = req.body;
    if (!userId || !amount || !reason) {
      return errorResponse(res, 400, 'User ID, amount, and reason are required');
    }

    const penalty = await authRepo.issuePenalty(userId, amount, reason);
    return successResponse(res, 201, 'Penalty issued successfully', penalty);
  } catch (error) {
    next(error);
  }
};

export const getUsersList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await authRepo.getAllUsers();
    return successResponse(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};