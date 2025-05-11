import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import {db} from "./src/db/index.js";
import userRoutes from "./src/routers/users.js";
import productRouters from "./src/routers/product.js";
import categoryRouters from "./src/routers/category.js";
import orderRouters from "./src/routers/order.js";
const app = express();


app.use(cors());
dotenv.config();

app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // for form data
app.use(morgan("dev"));
app.use("/users",userRoutes);
// app.use(express.static("uploads"));
app.use("/uploads", express.static("uploads"));
app.use(productRouters)
app.use(categoryRouters)
app.use(orderRouters)

db();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});