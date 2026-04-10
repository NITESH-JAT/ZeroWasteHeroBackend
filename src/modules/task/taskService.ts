//src/modules/task/taskService.ts
import * as taskRepo from './taskRepository';
import { CreateTaskPayload } from './taskTypes';
import { uploadBufferToCloudinary } from '../../utils/cloudinaryHelper';
import * as rewardService from '../reward/rewardService';
import * as reportRepo from '../report/reportRepository';

export const createNewTask = async (data: CreateTaskPayload) => {
  if (!data.reportId && !data.campaignId) {
    throw new Error('A task must be linked to either a report or a campaign');
  }
  return await taskRepo.createTask(data);
};

export const fetchOpenTasks = async () => {
  return await taskRepo.getOpenTasks();
};

export const claimTask = async (taskId: string, workerId: string) => {
  const updatedTask = await taskRepo.assignWorkerToTask(taskId, workerId);
  if (!updatedTask) {
    throw new Error('Task not found or already assigned');
  }
  return updatedTask;
};

export const submitTaskProof = async (taskId: string, workerId: string, imageBuffer: Buffer) => {

  const proofUrl = await uploadBufferToCloudinary(imageBuffer, 'zero-waste-proofs');
  const updatedTask = await taskRepo.submitProof(taskId, workerId, proofUrl);
  if (!updatedTask) {
    throw new Error('Task not found, or you are not assigned to it');
  }
  return updatedTask;
};

export const approveCompletedTask = async (taskId: string, championId: string) => {

  const verifiedTask = await taskRepo.verifyTaskCompletion(taskId, championId);
  if (!verifiedTask) {
    throw new Error('Task not found or not ready for verification');
  }


  if (verifiedTask.workerId) {
    await rewardService.rewardUser(
      verifiedTask.workerId, 
      verifiedTask.rewardPoints, 
      `Completed cleanup task: ${verifiedTask.id}`
    );
  }


  if (verifiedTask.reportId) {
    const report = await reportRepo.getReportById(verifiedTask.reportId);
    
    if (report && report.citizenId) {
      const CITIZEN_BONUS_POINTS = 15;
      
      await rewardService.rewardUser(
        report.citizenId, 
        CITIZEN_BONUS_POINTS, 
        `Your reported waste was cleaned up! Thank you!`
      );
    }
  }

  return verifiedTask;
};