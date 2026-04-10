import { query } from '../../config/db';

export const getChampionStats = async () => {
  const pendingRes = await query(`SELECT COUNT(*) FROM reports WHERE status = 'PENDING'`);
  const urgentRes = await query(`SELECT COUNT(*) FROM reports WHERE status = 'PENDING' AND created_at < NOW() - INTERVAL '24 HOURS'`);
  
  return {
    pendingCount: parseInt(pendingRes.rows[0].count, 10),
    urgentCount: parseInt(urgentRes.rows[0].count, 10),
    accuracy: "98%" // Hardcoded for now, could be dynamic later based on rejected tasks
  };
};

export const getWorkers = async () => {
  const sql = `
    SELECT id, first_name AS "firstName", last_name AS "lastName", role
    FROM users
    WHERE role = 'WORKER'
  `;
  const result = await query(sql);
  return result.rows;
};

export const getApprovedReports = async () => {
  // Fetches reports that have been verified, along with their linked task status
  const sql = `
    SELECT 
      r.id, r.category, r.description, r.image_url AS "imageUrl", r.status AS "reportStatus",
      t.status AS "taskStatus", u.first_name AS "workerFirstName"
    FROM reports r
    LEFT JOIN tasks t ON r.id = t.report_id
    LEFT JOIN users u ON t.worker_id = u.id
    WHERE r.status IN ('VERIFIED', 'CLEANED')
    ORDER BY r.updated_at DESC
  `;
  const result = await query(sql);
  return result.rows;
};