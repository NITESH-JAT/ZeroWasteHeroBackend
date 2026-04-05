import app from './app';
import { dbPool } from './config/db';
import dotenv from 'dotenv';


dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Verify database connection before starting the server
    const client = await dbPool.connect();
    console.log('✅ Successfully connected to PostgreSQL (NeonDB)');
    client.release();

    app.listen(PORT, () => {
      console.log(`API : http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database. Server not started.', error);
    process.exit(1);
  }
};

startServer();