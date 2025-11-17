import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser 
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Auth Routes
router.post('/register', registerUser); // POST /api/users/register
router.post('/login', loginUser);     // POST /api/users/login
router.post('/logout', logoutUser);   // POST /api/users/logout

// Protected Route Example (e.g., fetching user profile)
router.get('/profile', protect, (req, res) => {
  // req.user is available here due to protect middleware
  res.json(req.user);
});

// Admin Protected Route Example
router.get('/admin-data', protect, admin, (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default router;