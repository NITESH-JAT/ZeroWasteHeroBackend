import { query } from '../../config/db';
import { CreateCampaignPayload, CampaignRecord } from './campaignTypes';

export const createCampaign = async (ngoId: string, data: CreateCampaignPayload): Promise<CampaignRecord> => {
  const sql = `
    INSERT INTO campaigns (ngo_id, title, description, latitude, longitude, start_date, end_date, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE')
    RETURNING 
      id, ngo_id AS "ngoId", title, description, latitude, longitude, 
      start_date AS "startDate", end_date AS "endDate", status, created_at AS "createdAt"
  `;
  
  const values = [
    ngoId, 
    data.title, 
    data.description, 
    data.latitude || null, 
    data.longitude || null, 
    data.startDate, 
    data.endDate
  ];
  
  const result = await query(sql, values);
  return result.rows[0];
};

export const getActiveCampaigns = async (): Promise<CampaignRecord[]> => {
  const sql = `
    SELECT 
      id, ngo_id AS "ngoId", title, description, latitude, longitude, 
      start_date AS "startDate", end_date AS "endDate", status, created_at AS "createdAt"
    FROM campaigns
    WHERE status = 'ACTIVE'
    ORDER BY start_date ASC
  `;
  const result = await query(sql);
  return result.rows;
};