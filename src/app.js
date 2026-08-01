import express from "express";
import cors from "cors";
import pollRoutes from "./routes/poll.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.use("/api/polls", pollRoutes);

app.use(errorHandler);

export default app;
