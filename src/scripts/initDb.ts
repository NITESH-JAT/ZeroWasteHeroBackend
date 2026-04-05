// src/scripts/initDb.ts
import fs from 'fs';
import path from 'path';
import { dbPool } from '../config/db';

const initializeDatabase = async () => {
  try {
    console.log('⏳ Starting database initialization...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute the SQL
    await dbPool.query(schemaSql);
    
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    // Close the pool connection so the script can exit
    await dbPool.end();
    process.exit(0);
  }
};

initializeDatabase();