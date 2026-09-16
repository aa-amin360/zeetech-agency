import pg from "pg";
import { config } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test and log database connection status
export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL Database connected successfully");
    client.release();
    return true;
  } catch (error) {
    console.warn(
      "PostgreSQL connection failed. Fallback dataset will be used automatically.",
    );
    console.warn(`Reason: ${error.message}`);
    return false;
  }
};
