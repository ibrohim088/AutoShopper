import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import {db} from "./src/db/index.js";
import userRoutes from "./src/routes/users.js";

const app = express();



app.use(cors());
dotenv.config();

app.use(express.json());
app.use(morgan("dev"));
app.use("/users", userRoutes);

db();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});