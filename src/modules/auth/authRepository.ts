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

export const createUser = async (userData: RegisterData): Promise<UserRecord> => {
  const sql = `
    INSERT INTO users (first_name, last_name, email, password_hash, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, first_name AS "firstName", last_name AS "lastName", email, role, green_points AS "greenPoints"
  `;
  const values = [
    userData.firstName, 
    userData.lastName, 
    userData.email, 
    userData.passwordHash, 
    userData.role || 'CITIZEN'
  ];
  
  const result = await query(sql, values);
  return result.rows[0];
};