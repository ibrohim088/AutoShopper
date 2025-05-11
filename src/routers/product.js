import express from "express";
import { upload } from "../shared/multer.js";
import Product from "../schema/Product.js";
import Category from "../schema/Category.js"; // ✅ Import Category to validate category ID

const router = express.Router();

// GET all products with category populated
router.get("/product", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).send({ data: products });
  } catch (error) {
    res.status(500).send({ error: "Error: " + error.message });
  }
});

// GET product by ID with category populated
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ data: product });
  } catch (error) {
    res.status(500).send({ error: "Error: " + error.message });
  }
});

// POST create new product with category ID
router.post("/product", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    console.log("Received req.body:", req.body);

    if (!req.file) {
      return res.status(400).send({ message: "Image file is required" });
    }

    if (!category) {
      return res.status(400).send({ message: "Category ID is required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).send({ message: "Category not found" });
    }

    const product = new Product({
      name,
      description,
      price,
      image: `uploads/${req.file.filename}`,
      category,
    });

    await product.save();
    res.status(201).send({ data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Error: " + error.message });
  }
});

// PATCH update product and category
router.patch("/product/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (price) updatedFields.price = price;
    if (description) updatedFields.description = description;
    if (req.file) updatedFields.image = `uploads/${req.file.filename}`;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).send({ message: "Category not found" });
      }
      updatedFields.category = category;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({ data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ error: "Error: " + error.message });
  }
});

// DELETE product by ID
router.delete("/product/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send({ message: "Product deleted", data: deletedProduct });
  } catch (error) {
    res.status(500).send({ error: "Error: " + error.message });
  }
});

export default router;
