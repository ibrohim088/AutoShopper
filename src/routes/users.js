// import express from 'express';
// import User from '../schema/User.js';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import auth from '../auth/isLogin.js'; // assumes this file exports middleware

// dotenv.config();
// const router = express.Router();

// // Get all users (for admin maybe)
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json({ data: users });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ✅ Protected route - get current user info
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Register user
// // router.post('/register', async (req, res) => {
// //   try {
// //     const { username, fullname, email, password, role } = req.body;

// //     const existing = await User.findOne({ email });
// //     if (existing) return res.status(400).json({ message: 'User already exists' });

// //     const user = new User({ username, fullname, email, password, role });
// //     await user.save();

// //     res.status(201).json({
// //       message: 'User registered successfully',
// //       // userId: user._id,
// //       username: user.username,
// //       fullname: user.fullname,
// //       email: user.email,
// //       // role: user.role,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: 'Registration failed', error: err.message });
// //   }
// // });
// router.post('/register', async (req, res) => {
//   try {
//     const { username, fullname, email, password, role } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'User already exists' });

//     const user = new User({ username, fullname, email, password, role });
//     await user.save();
//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );
//     res.status(201).json({
//       message: 'User registered successfully',
//       username: user.username,
//       fullname: user.fullname,
//       email: user.email,
//     });
//   } catch (err) {
//     console.error('Error during registration:', err);  // Add detailed logging here
//     res.status(500).json({ message: 'Registration failed', error: err.message });
//   }
// });


// // Login user
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({ message: 'Login successful', token });
//   } catch (err) {
//     res.status(500).json({ message: 'Login failed', error: err.message });
//   }
// });

// // Delete user
// router.delete('/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete user', error: err.message });
//   }
// });

// export default router;

import express from 'express';
import User from '../schema/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import auth from '../auth/isLogin.js'; // assumes this file exports middleware

dotenv.config();
const router = express.Router();

// Get all users (for admin maybe)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Protected route - get current user info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, fullname, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    
    const user = new User({ username, fullname, email, password, role });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      data: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Include user data in the response
    res.json({ 
      message: 'Login successful', 
      token,
      data: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        created_at: user.created_at
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

export default router;