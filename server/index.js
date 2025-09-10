import express from "express";
import cors from "cors";
import { user_route } from "./routes/user.js";
const app = express();
import { b_port as port, FRONTEND_URL } from "./.config/config.js";
app.use(
  // cors({
  //   origin: FRONTEND_URL,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'token'],
  // })
  cors()
);
app.use(express.json());
app.use("/api", user_route);

import { connectDB } from "./database/db.js";

connectDB();

app.listen(port,()=>{
  console.log(`Listening port ${port}`);
});
export default app;