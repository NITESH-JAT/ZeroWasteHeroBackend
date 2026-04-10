import { query } from '../../config/db';

export const getNgoStats = async (ngoId: string) => {
  // Count how many active drives this NGO has
  const campaignsRes = await query(
    `SELECT COUNT(*) FROM campaigns WHERE ngo_id = $1 AND status = 'ACTIVE'`, 
    [ngoId]
  );
  
  // Get their budget/green points from the users table
  const userRes = await query(
    `SELECT green_points FROM users WHERE id = $1`, 
    [ngoId]
  );

  return {
    activeCampaigns: parseInt(campaignsRes.rows[0]?.count || "0", 10),
    totalVolunteers: 124, // Dummy metric for now until you add a volunteers table
    budget: parseInt(userRes.rows[0]?.green_points || "50000", 10),
    wasteCollected: "1,240 kg" // Dummy metric
  };
};

export const getMyCampaigns = async (ngoId: string) => {
  const sql = `
    SELECT 
      id, title, description, date, status, image_url AS "imageUrl", 
      distance_km AS "distanceKm", created_at AS "createdAt"
    FROM campaigns
    WHERE ngo_id = $1
    ORDER BY created_at DESC
  `;
  const result = await query(sql, [ngoId]);
  return result.rows;
};