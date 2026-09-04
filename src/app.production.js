import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import pollRoutes from "./routes/poll.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import voteRoutes from "./routes/vote.routes.js";
import resultRoutes from "./routes/result.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------
// Middleware
// ------------------------------------------

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
    limit: "50kb",
  }),
);

app.use(cookieParser());

// ------------------------------------------
// Existing backend public files
// ------------------------------------------

app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------
// API routes
// ------------------------------------------

app.use("/api/polls", authRoutes);
app.use("/api/polls", dashboardRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/polls", voteRoutes);
app.use("/api/polls", resultRoutes);

// ------------------------------------------
// Health check
// ------------------------------------------

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// ------------------------------------------
// React production build
// ------------------------------------------

const frontendDistPath = path.join(__dirname, "../live-polls/dist");

app.use(express.static(frontendDistPath));

// ------------------------------------------
// React Router fallback
// ------------------------------------------

app.use((req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  // Never send React HTML for API requests
  if (req.path.startsWith("/api/")) {
    return next();
  }

  // Let the health endpoint continue to the next middleware
  if (req.path === "/health") {
    return next();
  }

  return res.sendFile(path.join(frontendDistPath, "index.html"));
});

// ------------------------------------------
// Error handler
// ------------------------------------------

app.use(errorHandler);

export default app;
