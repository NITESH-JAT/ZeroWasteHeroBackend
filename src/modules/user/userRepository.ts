import { query } from '../../config/db';

export const getTopUsersByPoints = async (limit: number = 10) => {
  const sql = `
    SELECT id, first_name AS "firstName", last_name AS "lastName", role, green_points AS "greenPoints", current_streak AS "currentStreak"
    FROM users
    WHERE role IN ('CITIZEN', 'WORKER', 'CHAMPION')
    ORDER BY green_points DESC
    LIMIT $1
  `;
  const result = await query(sql, [limit]);
  return result.rows;
};