import express from "express";
import cors from "cors";
import { user_route } from "./routes/user.js";
const app = express();
import { b_port as port } from "../.config/config.js";
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'token'],
  })
);
app.use(express.json());
app.use("/api", user_route);

app.listen(port,()=>{
  console.log(`Listening port ${port}`);
});
