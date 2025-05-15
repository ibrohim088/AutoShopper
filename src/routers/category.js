import express from 'express';
import Category from '../schema/Category.js';
import {upload} from '../shared/multer.js';
import Product from '../schema/Product.js';


const router = express.Router();

// GET all categories
router.get('/category', async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: category._id });
        return {
          ...category.toObject(),
          products,
        };
      })
    );

    res.status(200).json({ data: categoriesWithProducts });
  } catch (error) {
    res.status(500).json({ error: 'Error: ' + error.message });
  }
});


// GET category by ID
router.get('/category/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id });

    res.status(200).json({
      data: {
        category,
        products,
      }
    });
  } catch (error) {
    console.error('Error fetching category with products:', error);
    res.status(500).json({ error: 'Error: ' + error.message });
  }
});


// POST create new category
router.post('/category', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;

    console.log('Received req.body:', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const category = new Category({
      name,
      description, // ✅ include this
      image: `uploads/${req.file.filename}`,
    });

    await category.save();
    res.status(201).json({ data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Error: ' + error.message });
  }
});


// PUT update category by ID
router.put('/category/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;

    console.log('Received req.body:', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description, // ✅ include this
        image: `uploads/${req.file.filename}`,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Error: ' + error.message });
  }
});


// DELETE category by ID
router.delete('/category/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Error: ' + error.message });
  }
});

export default router;