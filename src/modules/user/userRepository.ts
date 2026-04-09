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
  try {
    // Using LOWER() ensures it counts regardless of if you saved it as 'VERIFIED', 'verified', or 'Verified'
    const reportRes = await query(`SELECT COUNT(*) FROM reports WHERE citizen_id = $1 AND LOWER(status) = 'verified'`, [citizenId]);
    const bidRes = await query(`SELECT COUNT(*) FROM scrap_listings WHERE citizen_id = $1 AND LOWER(status) = 'accepted'`, [citizenId]);
    
    return {
      verifiedReports: parseInt(reportRes.rows[0]?.count || '0', 10),
      campaignsJoined: parseInt(bidRes.rows[0]?.count || '0', 10)
    };
  } catch (error) {
    console.error("Database Stats Error:", error);
    // If the DB query fails, gracefully return 0 instead of crashing the server
    return { verifiedReports: 0, campaignsJoined: 0 };
  }
};