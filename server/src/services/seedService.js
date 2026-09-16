import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool, testDbConnection } from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrationsAndSeeds = async () => {
  console.log("🔄 Checking database connection and running migrations...");
  const isConnected = await testDbConnection();

  if (!isConnected) {
    console.log(
      "⚠️ Running in mock/fallback mode. Database operations bypassed.",
    );
    return;
  }

  try {
    const rootSchemaPath = path.resolve(
      __dirname,
      "../../../database/schema.sql",
    );
    const rootSeedPath = path.resolve(__dirname, "../../../database/seed.sql");

    if (fs.existsSync(rootSchemaPath)) {
      const schemaSql = fs.readFileSync(rootSchemaPath, "utf-8");
      await pool.query(schemaSql);
      console.log("✅ Database schema migrated successfully.");
    }

    if (fs.existsSync(rootSeedPath)) {
      const seedSql = fs.readFileSync(rootSeedPath, "utf-8");
      await pool.query(seedSql);
      console.log("✅ Database seed records inserted successfully.");
    }
  } catch (error) {
    console.error("❌ Error executing database seed:", error.message);
  }
};

// If run directly: `node src/services/seedService.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrationsAndSeeds().then(() => {
    process.exit(0);
  });
}
