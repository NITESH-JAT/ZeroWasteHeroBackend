import { query } from '../../config/db';

export const getSystemStats = async () => {
  // We use parallel queries to get all the data at once efficiently
  const reportsPromise = query(`
    SELECT status, COUNT(*) as count FROM reports GROUP BY status
  `);
  
  const pointsPromise = query(`
    SELECT SUM(green_points) as "totalPointsAwarded" FROM users
  `);

  const usersPromise = query(`
    SELECT role, COUNT(*) as count FROM users GROUP BY role
  `);

  const [reportsRes, pointsRes, usersRes] = await Promise.all([
    reportsPromise, pointsPromise, usersPromise
  ]);

  return {
    reports: reportsRes.rows,
    users: usersRes.rows,
    totalPointsAwarded: pointsRes.rows[0]?.totalPointsAwarded || 0
  };
};