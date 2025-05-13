import mongoose from "mongoose";

export function db() {
  mongoose
    .connect("mongodb://localhost/AutoShopper ", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));
}

