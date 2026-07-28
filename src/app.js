import express from "express";
import cors from "cors";

const app = express();

app.use(cors);
app.use(express.json({}));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.get("/", (req, res) => {
  res.send("polls api running");
});

export default app;
