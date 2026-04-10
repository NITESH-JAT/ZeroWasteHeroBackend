//src/modules/auth/authRepository.ts
import { query } from '../../config/db';
import { RegisterData, UserRecord } from './authTypes';

export const findUserByEmail = async (email: string): Promise<UserRecord | null> => {
  const sql = `
    SELECT id, first_name AS "firstName", last_name AS "lastName", email, password_hash AS "passwordHash", role, green_points AS "greenPoints"
    FROM users 
    WHERE email = $1
  `;
  const result = await query(sql, [email]);
  return result.rows.length ? result.rows[0] : null;
};

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
  govIdUrl?: string;
}) => {
  const sql = `
    INSERT INTO users (first_name, last_name, email, password_hash, role, gov_id_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, first_name AS "firstName", last_name AS "lastName", email, role, green_points AS "greenPoints", gov_id_url AS "govIdUrl"
  `;
  
  // Extract the values from the 'data' object
  const result = await query(sql, [
    data.firstName, 
    data.lastName, 
    data.email, 
    data.passwordHash, 
    data.role, 
    data.govIdUrl || null
  ]);
  
  return result.rows[0];
};