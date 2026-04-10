//src/modules/user/userRepository.ts
import { query } from '../../config/db';

export const getTopUsersByPoints = async (limit: number = 100) => {
  const sql = `
    SELECT id, first_name AS "firstName", last_name AS "lastName", role, green_points AS "greenPoints", current_streak AS "currentStreak"
    FROM users
    WHERE role = 'CITIZEN' 
    ORDER BY green_points DESC
  `;
  const result = await query(sql, [limit]);
  return result.rows;
};

export const getUserStats = async (userId: string, role: string) => {
  try {
    if (role === 'CITIZEN') {
      const reportRes = await query(`SELECT COUNT(*) FROM reports WHERE citizen_id = $1 AND LOWER(status) = 'verified'`, [userId]);
      const bidRes = await query(`SELECT COUNT(*) FROM scrap_listings WHERE citizen_id = $1 AND LOWER(status) = 'accepted'`, [userId]);
      return {
        verifiedReports: parseInt(reportRes.rows[0]?.count || '0', 10),
        campaignsJoined: parseInt(bidRes.rows[0]?.count || '0', 10)
      };
    } else if (role === 'SCRAPPER') {
      // Calculate Scrapper Stats!
      const spentRes = await query(`SELECT SUM(amount) FROM scrap_bids WHERE scrapper_id = $1 AND LOWER(status) = 'accepted'`, [userId]);
      const bidsRes = await query(`SELECT COUNT(*) FROM scrap_bids WHERE scrapper_id = $1`, [userId]);
      const pickupsRes = await query(`SELECT COUNT(*) FROM scrap_bids WHERE scrapper_id = $1 AND LOWER(status) = 'accepted'`, [userId]);
      return {
        totalSpent: parseFloat(spentRes.rows[0]?.sum || '0'),
        bidsPlaced: parseInt(bidsRes.rows[0]?.count || '0', 10),
        pickupsCompleted: parseInt(pickupsRes.rows[0]?.count || '0', 10)
      };
    }
    return {};
  } catch (error) {
    console.error("Database Stats Error:", error);
    return { verifiedReports: 0, campaignsJoined: 0, totalSpent: 0, bidsPlaced: 0, pickupsCompleted: 0 };
  }
};