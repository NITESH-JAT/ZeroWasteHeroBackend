import { Response, NextFunction } from 'express';
import * as reportService from './reportService';
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes'; // <-- Import our custom type
import * as reportRepo from './reportRepository';

export const createReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user!.userId; 
    const { description, latitude, longitude } = req.body;
    const file = req.file;

    if (!file) {
      return errorResponse(res, 400, 'Waste image is required');
    }

    if (latitude === undefined || longitude === undefined) {
      return errorResponse(res, 400, 'Latitude and longitude are required');
    }

    const report = await reportService.submitReport(
      citizenId, 
      { description, latitude: Number(latitude), longitude: Number(longitude) }, 
      file.buffer
    );
    
    return successResponse(res, 201, 'Waste report submitted successfully', report);
  } catch (error: any) {
    if (error.message === 'Invalid GPS coordinates provided' || error.message === 'Only image files are allowed!') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

export const getPendingReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await reportService.fetchPendingReports();
    return successResponse(res, 200, 'Pending reports fetched successfully', reports);
  } catch (error) {
    next(error);
  }
};


export const verifyReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const championId = req.user!.userId;
    const { id } = req.params;
    const { isValid } = req.body;

    if (typeof isValid !== 'boolean') {
      return errorResponse(res, 400, 'The isValid boolean flag is required');
    }

    const report = await reportService.verifyWasteReport(id, championId, isValid);
    return successResponse(res, 200, `Report marked as ${report.status}`, report);
  } catch (error: any) {
    if (error.message === 'Report not found') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};


export const getMyReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const citizenId = req.user?.userId;
    if (!citizenId) {
      return errorResponse(res, 401, 'Unauthorized');
    }

    const reports = await reportRepo.getReportsByCitizenId(citizenId);
    
    return successResponse(res, 200, 'My reports fetched successfully', reports);
  } catch (error) {
    next(error);
  }
};