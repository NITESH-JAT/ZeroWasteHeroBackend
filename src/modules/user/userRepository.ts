import { query } from '../../config/db';

export const getTopUsersByPoints = async (limit: number = 100) => {
  const sql = `
    SELECT id, first_name AS "firstName", last_name AS "lastName", role, green_points AS "greenPoints", current_streak AS "currentStreak"
    FROM users
    WHERE role = 'CITIZEN' 
    ORDER BY green_points DESC
    LIMIT $1
  `;
  const result = await query(sql, [limit]);
  return result.rows;
};

export const getUserStats = async (citizenId: string) => {
  // 1. Count how many of their reports have been verified
  const reportRes = await query(`SELECT COUNT(*) FROM reports WHERE citizen_id = $1 AND status = 'verified'`, [citizenId]);
  
  // 2. Count how many of their scrap listings have been successfully sold (ACCEPTED)
  const bidRes = await query(`SELECT COUNT(*) FROM scrap_listings WHERE citizen_id = $1 AND status = 'ACCEPTED'`, [citizenId]);
  
  return {
    verifiedReports: parseInt(reportRes.rows[0].count, 10),
    campaignsJoined: parseInt(bidRes.rows[0].count, 10) // We are mapping this to "Items Sold" in the UI
  };
};