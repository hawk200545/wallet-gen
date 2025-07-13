import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import {user_route} from "./user.js";
const app = express();
const port = process.env.PORT;
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "token"],
  })
);
app.use(express.json());
app.use("/user", user_route);

app.listen(port, () =>
  console.log(`server is running at http://localhost:${port}`)
);
