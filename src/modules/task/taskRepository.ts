//src/modules/task/taskRepository.ts
import { query } from '../../config/db';
import { CreateTaskPayload, TaskRecord } from './taskTypes';

export const createTask = async (data: CreateTaskPayload): Promise<TaskRecord> => {
  const sql = `
    INSERT INTO tasks (report_id, campaign_id, reward_points)
    VALUES ($1, $2, $3)
    RETURNING 
      id, report_id AS "reportId", campaign_id AS "campaignId", worker_id AS "workerId",
      status, reward_points AS "rewardPoints", proof_image_url AS "proofImageUrl", 
      verified_by AS "verifiedBy", created_at AS "createdAt"
  `;
  const values = [data.reportId || null, data.campaignId || null, data.rewardPoints];
  const result = await query(sql, values);
  return result.rows[0];
};

export const getOpenTasks = async (): Promise<TaskRecord[]> => {
  const sql = `
    SELECT 
      id, report_id AS "reportId", campaign_id AS "campaignId", worker_id AS "workerId",
      status, reward_points AS "rewardPoints", proof_image_url AS "proofImageUrl", 
      verified_by AS "verifiedBy", created_at AS "createdAt"
    FROM tasks
    WHERE status = 'OPEN'
    ORDER BY created_at DESC
  `;
  const result = await query(sql);
  return result.rows;
};

export const assignWorkerToTask = async (taskId: string, workerId: string): Promise<TaskRecord | null> => {
  const sql = `
    UPDATE tasks 
    SET worker_id = $1, status = 'ASSIGNED', updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND status = 'OPEN'
    RETURNING 
      id, report_id AS "reportId", campaign_id AS "campaignId", worker_id AS "workerId",
      status, reward_points AS "rewardPoints", proof_image_url AS "proofImageUrl", 
      verified_by AS "verifiedBy", created_at AS "createdAt"
  `;
  const result = await query(sql, [workerId, taskId]);
  return result.rows[0] || null;
};

export const getTaskById = async (taskId: string): Promise<TaskRecord | null> => {
  const sql = `
    SELECT 
      id, report_id AS "reportId", campaign_id AS "campaignId", worker_id AS "workerId",
      status, reward_points AS "rewardPoints", proof_image_url AS "proofImageUrl", 
      verified_by AS "verifiedBy", created_at AS "createdAt"
    FROM tasks WHERE id = $1
  `;
  const result = await query(sql, [taskId]);
  return result.rows[0] || null;
};

export const submitProof = async (taskId: string, workerId: string, proofImageUrl: string): Promise<TaskRecord | null> => {
  const sql = `
    UPDATE tasks 
    SET proof_image_url = $1, status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND worker_id = $3 AND status = 'ASSIGNED'
    RETURNING *
  `;
  const result = await query(sql, [proofImageUrl, taskId, workerId]);
  return result.rows[0] || null;
};

export const verifyTaskCompletion = async (taskId: string, championId: string): Promise<any | null> => {
  const sql = `
    UPDATE tasks 
    SET status = 'VERIFIED', verified_by = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND status = 'COMPLETED'
    RETURNING 
      id, worker_id AS "workerId", reward_points AS "rewardPoints", report_id AS "reportId" 
  `;
  const result = await query(sql, [championId, taskId]);
  return result.rows[0] || null;
};

export const getTasksByWorker = async (workerId: string) => {
  const sql = `
    SELECT 
      t.id, t.report_id AS "reportId", t.status, t.reward_points AS "rewardPoints", 
      t.created_at AS "createdAt",
      r.description, r.image_url AS "reportImageUrl", r.latitude, r.longitude
    FROM tasks t
    LEFT JOIN reports r ON t.report_id = r.id
    WHERE t.worker_id = $1
    ORDER BY t.created_at DESC
  `;
  const result = await query(sql, [workerId]);
  return result.rows;
};