import express from "express";
import cors from "cors";
import pollRoutes from "./routes/poll.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import voteRoutes from "./routes/vote.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.use("/api/polls", pollRoutes);
app.use("/api/polls", voteRoutes);

app.use(errorHandler);

export default app;
