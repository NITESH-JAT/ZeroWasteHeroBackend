//src/modules/task/taskController.ts
import { Response, NextFunction } from 'express';
import * as taskService from './taskService';
import * as taskRepo from './taskRepository';
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { AuthRequest } from '../../types/globalTypes';


export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reportId, campaignId, rewardPoints } = req.body;

    if (!rewardPoints) {
      return errorResponse(res, 400, 'Reward points are required to create a task');
    }

    const task = await taskService.createNewTask({ reportId, campaignId, rewardPoints });
    return successResponse(res, 201, 'Task created successfully', task);
  } catch (error: any) {
    if (error.message === 'A task must be linked to either a report or a campaign') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

export const getOpenTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.fetchOpenTasks();
    return successResponse(res, 200, 'Open tasks fetched successfully', tasks);
  } catch (error) {
    next(error);
  }
};

export const claimTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workerId = req.user!.userId;
    const { id } = req.params; // Task ID

    const task = await taskService.claimTask(id, workerId);
    return successResponse(res, 200, 'Task claimed successfully', task);
  } catch (error: any) {
    if (error.message === 'Task not found or already assigned') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

export const completeTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workerId = req.user!.userId;
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return errorResponse(res, 400, 'Proof image is required to complete a task');
    }

    const task = await taskService.submitTaskProof(id, workerId, file.buffer);
    return successResponse(res, 200, 'Proof submitted successfully. Awaiting verification.', task);
  } catch (error: any) {
    if (error.message.includes('not assigned')) {
      return errorResponse(res, 403, error.message);
    }
    next(error);
  }
};

export const verifyTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const championId = req.user!.userId;
    const { id } = req.params;

    const task = await taskService.approveCompletedTask(id, championId);
    return successResponse(res, 200, `Task verified! Worker rewarded with ${task.rewardPoints} points.`, task);
  } catch (error: any) {
    next(error);
  }
};


export const getMyTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workerId = req.user!.userId;
    const tasks = await taskRepo.getTasksByWorker(workerId);
    return successResponse(res, 200, 'My tasks fetched successfully', tasks);
  } catch (error) {
    next(error);
  }
};