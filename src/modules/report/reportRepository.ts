//src/modules/report/reportRepository.ts
import { query } from '../../config/db';
import { CreateReportPayload, ReportRecord } from './reportTypes';

export const createReport = async (citizenId: string, data: CreateReportPayload): Promise<ReportRecord> => {
  const sql = `
    INSERT INTO reports (citizen_id, description, image_url, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING 
      id, 
      citizen_id AS "citizenId", 
      description, 
      image_url AS "imageUrl", 
      latitude, 
      longitude, 
      status, 
      verified_by AS "verifiedBy", 
      created_at AS "createdAt"
  `;
  
  const values = [
    citizenId, 
    data.description || null, 
    data.imageUrl, 
    data.latitude, 
    data.longitude
  ];
  
  const result = await query(sql, values);
  return result.rows[0];
};

export const getReportsByStatus = async (status: string): Promise<ReportRecord[]> => {
  const sql = `
    SELECT 
      id, citizen_id AS "citizenId", description, image_url AS "imageUrl", 
      latitude, longitude, status, verified_by AS "verifiedBy", created_at AS "createdAt"
    FROM reports
    WHERE status = $1
    ORDER BY created_at DESC
  `;
  const result = await query(sql, [status]);
  return result.rows;
};

export const updateReportStatus = async (id: string, status: string, championId: string): Promise<ReportRecord | null> => {
  const sql = `
    UPDATE reports 
    SET status = $1, verified_by = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING 
      id, citizen_id AS "citizenId", description, image_url AS "imageUrl", 
      latitude, longitude, status, verified_by AS "verifiedBy", created_at AS "createdAt"
  `;
  const result = await query(sql, [status, championId, id]);
  return result.rows[0] || null;
};

export const getReportById = async (id: string): Promise<ReportRecord | null> => {
  const sql = `
    SELECT 
      id, citizen_id AS "citizenId", description, image_url AS "imageUrl", 
      latitude, longitude, status, verified_by AS "verifiedBy", created_at AS "createdAt"
    FROM reports 
    WHERE id = $1
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

export const getReportsByCitizenId = async (citizenId: string): Promise<ReportRecord[]> => {
  const sql = `
    SELECT 
      id, 
      citizen_id AS "citizenId", 
      description, 
      image_url AS "imageUrl", 
      latitude, 
      longitude, 
      status, 
      verified_by AS "verifiedBy", 
      created_at AS "createdAt"
    FROM reports
    WHERE citizen_id = $1
    ORDER BY created_at DESC
  `;
  const result = await query(sql, [citizenId]);
  return result.rows;
};