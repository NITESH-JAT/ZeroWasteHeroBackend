import { dbPool } from '../../config/db';

export const grantPoints = async (userId: string, points: number, reason: string): Promise<number> => {
  const client = await dbPool.connect();
  
  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Update the user's total points
    const updateSql = `
      UPDATE users 
      SET green_points = green_points + $1 
      WHERE id = $2 
      RETURNING green_points AS "greenPoints"
    `;
    const userResult = await client.query(updateSql, [points, userId]);
    
    // 2. Insert into the gamification ledger
    const ledgerSql = `
      INSERT INTO rewards_history (user_id, points_change, reason)
      VALUES ($1, $2, $3)
    `;
    await client.query(ledgerSql, [userId, points, reason]);

    await client.query('COMMIT'); // Save changes permanently
    
    return userResult.rows[0].greenPoints;
  } catch (error) {
    await client.query('ROLLBACK'); // Undo everything if an error occurs
    throw error;
  } finally {
    client.release(); // Return connection to the pool
  }
};