import dotenv from "dotenv";

console.log("1. server.js started");

import app from "./app.js";

console.log("2. app imported");

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log("3. starting listen on:", PORT);

app.listen(PORT, () => {
  console.log(`4. server running on ${PORT}`);
});
