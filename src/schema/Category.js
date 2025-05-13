import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
    description: { type: String, required: true },
    image: { type: String, required: true },
    
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);
const Category = mongoose.model("Category", categorySchema);
export default Category;