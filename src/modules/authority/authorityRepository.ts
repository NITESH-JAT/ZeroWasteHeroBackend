import { query } from '../../config/db';

export const getCityStats = async () => {
  const totalReportsRes = await query(`SELECT COUNT(*) FROM reports`);
  const resolvedReportsRes = await query(`SELECT COUNT(*) FROM reports WHERE status IN ('VERIFIED', 'CLEANED')`);
  const ngoCountRes = await query(`SELECT COUNT(*) FROM users WHERE role = 'NGO'`);
  
  const total = parseInt(totalReportsRes.rows[0].count, 10);
  const resolved = parseInt(resolvedReportsRes.rows[0].count, 10);
  
  // Calculate city segregation/cleanliness rate safely
  const cleanRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : "0.0";

  return {
    totalReports: total,
    resolvedReports: resolved,
    cleanRate: `${cleanRate}%`,
    activeNgos: parseInt(ngoCountRes.rows[0].count, 10)
  };
};

export const getAllNGOs = async () => {
  const sql = `
    SELECT id, first_name AS "firstName", email, green_points AS "greenPoints", created_at AS "createdAt"
    FROM users
    WHERE role = 'NGO'
    ORDER BY created_at DESC
  `;
  const result = await query(sql);
  return result.rows;
};

export const issuePenalty = async (userId: string, amount: number, reason: string) => {
  const sql = `
    INSERT INTO penalties (user_id, amount, reason)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await query(sql, [userId, amount, reason]);
  return result.rows[0];
};

export const getPenalties = async () => {
  const sql = `
    SELECT p.id, p.amount, p.reason, p.created_at AS "createdAt", u.first_name AS "firstName", u.last_name AS "lastName"
    FROM penalties p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;
  const result = await query(sql);
  return result.rows;
};