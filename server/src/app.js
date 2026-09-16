import express from "express";
import morgan from "morgan";
import { corsMiddleware } from "./middleware/cors.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Route imports
import projectRoutes from "./routes/projectRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();

// Request logging & Body parsing
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(corsMiddleware);

// Healthcheck Route
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

// REST API Resource Endpoints
app.use("/api/projects", projectRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/stats", statsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
