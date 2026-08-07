import express from "express";
import cors from "cors";
import pollRoutes from "./routes/poll.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import voteRoutes from "./routes/vote.routes.js";
import resultRoutes from "./routes/result.routes.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// Resolve current directory (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve files from /public
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/polls", pollRoutes);
app.use("/api/polls", voteRoutes);
app.use("/api/polls", resultRoutes);

app.use(errorHandler);

export default app;
