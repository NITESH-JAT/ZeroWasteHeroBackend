import { Response, NextFunction } from 'express';
import * as championRepo from './championRepository';
import * as reportRepo from '../report/reportRepository';
import * as taskRepo from '../task/taskRepository';
import * as rewardService from '../reward/rewardService';
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';

export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await championRepo.getChampionStats();
    return successResponse(res, 200, 'Stats fetched', stats);
  } catch (error) {
    next(error);
  }
};

export const getPendingReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await reportRepo.getReportsByStatus('PENDING');
    return successResponse(res, 200, 'Pending reports fetched', reports);
  } catch (error) {
    next(error);
  }
};

export const getApprovedReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await championRepo.getApprovedReports();
    return successResponse(res, 200, 'Approved reports fetched', reports);
  } catch (error) {
    next(error);
  }
};

export const getWorkers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workers = await championRepo.getWorkers();
    return successResponse(res, 200, 'Workers fetched', workers);
  } catch (error) {
    next(error);
  }
};

export const verifyAndAssign = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const championId = req.user!.userId;
    const reportId = req.params.id;
    const { workerId } = req.body;

    if (!workerId) return errorResponse(res, 400, 'Worker ID is required');

    // 1. Mark Report as Verified
    await reportRepo.updateReportStatus(reportId, 'VERIFIED', championId);

    // 2. Create a new Task linked to this report (Reward: 100 points for the worker)
    const task = await taskRepo.createTask({ reportId, rewardPoints: 100 });

    // 3. Assign the Task to the specific Worker
    const assignedTask = await taskRepo.assignWorkerToTask(task.id, workerId);

    return successResponse(res, 200, 'Report verified and assigned to worker', assignedTask);
  } catch (error) {
    next(error);
  }
};

export const getHotspots = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // For now, return a calculated mock hotspot based on pending volume
    const stats = await championRepo.getChampionStats();
    return successResponse(res, 200, 'Hotspots fetched', { 
      topArea: "Sector 4 / Market Road", 
      reportCount: stats.pendingCount 
    });
  } catch (error) {
    next(error);
  }
};

export const awardBonus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { workerId, points } = req.body;
    if (!workerId || !points) return errorResponse(res, 400, 'Worker ID and points required');

    await rewardService.rewardUser(workerId, Number(points), 'Champion Bonus Award');
    return successResponse(res, 200, `Awarded ${points} points to worker`);
  } catch (error) {
    next(error);
  }
};