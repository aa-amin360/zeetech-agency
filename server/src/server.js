import app from "./app.js";
import { config } from "./config/env.js";
import { testDbConnection } from "./config/database.js";

const PORT = config.port || 5000;

const startServer = async () => {
  // Test PostgreSQL connection (will automatically fallback to mock datasets if offline)
  await testDbConnection();

  app.listen(PORT, () => {
    console.log(
      `🚀 ZeeTech Server running in ${config.nodeEnv} mode on http://localhost:${PORT}`,
    );
    console.log(
      `📡 API Health Check available at http://localhost:${PORT}/api/health`,
    );
  });
};

startServer();
