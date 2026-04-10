import { query } from '../../config/db';

// --- CITIZEN ACTIONS ---
export const createScrapListing = async (citizenId: string, title: string, description: string, imageUrl: string, city: string) => {
  const sql = `
    INSERT INTO scrap_listings (citizen_id, title, description, image_url, city, status)
    VALUES ($1, $2, $3, $4, $5, 'OPEN')
    RETURNING *;
  `;
  const result = await query(sql, [citizenId, title, description, imageUrl, city]);
  return result.rows[0];
};

// --- SCRAPPER ACTIONS ---
export const getOpenListings = async (city: string) => {
  const sql = `
    SELECT sl.*, u.first_name AS "citizenFirstName", u.last_name AS "citizenLastName"
    FROM scrap_listings sl
    JOIN users u ON sl.citizen_id = u.id
    WHERE sl.status = 'OPEN' AND LOWER(sl.city) = LOWER($1)
    ORDER BY sl.created_at DESC;
  `;
  const result = await query(sql, [city]);
  return result.rows;
};

export const createBid = async (listingId: number, scrapperId: string, amount: number, proposedTime: string) => {
  const sql = `
    INSERT INTO scrap_bids (listing_id, scrapper_id, amount, proposed_time, status)
    VALUES ($1, $2, $3, $4, 'PENDING')
    RETURNING *;
  `;
  const result = await query(sql, [listingId, scrapperId, amount, proposedTime]);
  return result.rows[0];
};

// --- CITIZEN ACTIONS (Reviewing Bids) ---
export const getBidsForListing = async (listingId: number) => {
  const sql = `
    SELECT sb.*, u.first_name AS "scrapperFirstName", u.last_name AS "scrapperLastName"
    FROM scrap_bids sb
    JOIN users u ON sb.scrapper_id = u.id
    WHERE sb.listing_id = $1
    ORDER BY sb.amount DESC;
  `;
  const result = await query(sql, [listingId]);
  return result.rows;
};

export const getListingOwnerId = async (listingId: number) => {
  const sql = `SELECT citizen_id AS "citizenId", title FROM scrap_listings WHERE id = $1`;
  const result = await query(sql, [listingId]);
  return result.rows[0];
};

export const acceptBidTransaction = async (bidId: number, listingId: number) => {
  // We use a transaction because we need to update TWO tables at once safely
  await query('BEGIN');
  try {
    // 1. Mark the winning bid as ACCEPTED
    await query(`UPDATE scrap_bids SET status = 'ACCEPTED' WHERE id = $1`, [bidId]);
    
    // 2. Mark all other bids on this listing as REJECTED
    await query(`UPDATE scrap_bids SET status = 'REJECTED' WHERE listing_id = $1 AND id != $2`, [listingId, bidId]);
    
    // 3. Mark the listing itself as ACCEPTED so it leaves the public feed
    await query(`UPDATE scrap_listings SET status = 'ACCEPTED' WHERE id = $1`, [listingId]);
    
    await query('COMMIT');
    return true;
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
};

export const getMyListingsWithBids = async (citizenId: string) => {
  const sql = `
    SELECT 
      sl.id, 
      sl.citizen_id AS "citizenId", 
      sl.title, 
      sl.description, 
      sl.image_url AS "imageUrl", 
      sl.city, 
      sl.status, 
      sl.created_at AS "createdAt",
      COALESCE(
        json_agg(
          json_build_object(
            'id', sb.id,
            'amount', sb.amount,
            'status', sb.status
          )
        ) FILTER (WHERE sb.id IS NOT NULL), 
        '[]'
      ) as bids
    FROM scrap_listings sl
    LEFT JOIN scrap_bids sb ON sl.id = sb.listing_id
    WHERE sl.citizen_id = $1
    GROUP BY sl.id
    ORDER BY sl.created_at DESC;
  `;
  const result = await query(sql, [citizenId]);
  return result.rows;
};


export const getBidsByScrapper = async (scrapperId: string) => {
  const sql = `
    SELECT 
      sb.id, sb.amount, sb.proposed_time AS "proposedTime", sb.status, 
      sl.title AS "listingTitle", sl.image_url AS "listingImage"
    FROM scrap_bids sb
    JOIN scrap_listings sl ON sb.listing_id = sl.id
    WHERE sb.scrapper_id = $1
    ORDER BY sb.created_at DESC;
  `;
  const result = await query(sql, [scrapperId]);
  return result.rows;
};