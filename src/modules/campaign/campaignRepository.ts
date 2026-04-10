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

export const getActiveCampaigns = async (userLat?: number, userLng?: number) => {
  let sql = '';
  const values: any[] = [];

  try {
    if (userLat !== undefined && userLng !== undefined) {
      // Safely casting everything to ::float8 stops Postgres from throwing type errors
      sql = `
        SELECT 
          c.id, c.title, c.date, c.latitude, c.longitude, c.points, 
          c.image_url AS "image", c.attendees, c.tags, u.first_name AS "ngo",
          ROUND(
            (6371 * acos(
              cos(radians($1::float8)) * cos(radians(c.latitude::float8)) * cos(radians(c.longitude::float8) - radians($2::float8)) + 
              sin(radians($1::float8)) * sin(radians(c.latitude::float8))
            ))::numeric, 
          1) AS "distanceKm"
        FROM campaigns c
        JOIN users u ON c.ngo_id = u.id
        WHERE c.status = 'ACTIVE' AND c.latitude IS NOT NULL AND c.longitude IS NOT NULL
        ORDER BY "distanceKm" ASC;
      `;
      values.push(userLat, userLng);
    } else {
      sql = `
        SELECT 
          c.id, c.title, c.date, c.latitude, c.longitude, c.points, 
          c.image_url AS "image", c.attendees, c.tags, u.first_name AS "ngo" 
        FROM campaigns c
        JOIN users u ON c.ngo_id = u.id
        WHERE c.status = 'ACTIVE'
        ORDER BY c.created_at DESC
        LIMIT 20;
      `;
    }

    const result = await query(sql, values);
    return result.rows;
  } catch (error) {
    console.error("Database Campaign Error:", error);
    return []; // Return an empty array instead of 500ing the server
  }
};