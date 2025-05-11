// import mongoose from "mongoose";
// import Category from "./Category.js";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, unique: true, trim: true },
//     description: { type: String, required: true },
//     image: { type: String, required: true },
//     price: { type: Number, required: true },
//     isActive: { type: Boolean, default: true },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//   },
//   {
//     timestamps: {
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//     versionKey: false,
//   }
// );

// const Product = mongoose.model("Product", productSchema);

// // ✅ Default export so you can use `import Product from ...`
// export default Product;


import mongoose from "mongoose";
import Category from "./Category.js"; // ensure this path is correct and the file is named Category.js

const { Schema, model, Types } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

const Product = model("Product", productSchema);

export default Product;
