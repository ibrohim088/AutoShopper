// product.js (Controller & Model)

import express from "express";
import { upload } from "../shared/multer.js";
import Product from "../schema/Product.js";  // Adjust this path according to your project structure
const router = express.Router();

// GET all products
router.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({ data: products });
  } catch (error) {
    res.status(500).send({ error: "Error: " + error.message });
  }
});

// GET product by ID
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ data: product });
  } catch (error) {
    res.status(500).send({ error: "Error: " + error.message });
  }
});

// POST create new product
router.post("/product" , upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Debugging print
    console.log("Received req.body:", req.body);

    // Ensure the image file is received
    if (!req.file) {
      return res.status(400).send({ message: "Image file is required" });
    }

    // Create a new product document
    const product = new Product({
      name,
      description,
      price,
      image: `uploads/${req.file.filename}`,  // Assuming image is stored in the 'uploads' folder
    });

    // Save product to the database
    await product.save();
    res.status(201).send({ data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Error: " + error.message });
  }
});

// PATCH update product
router.patch("/product/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (price) updatedFields.price = price;
    if (description) updatedFields.description = description;
    if (req.file) updatedFields.image = `uploads/${req.file.filename}`;

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
