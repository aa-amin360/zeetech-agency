import cors from "cors";
import { config } from "../config/env.js";

export const corsMiddleware = cors({
  origin: [config.clientUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
