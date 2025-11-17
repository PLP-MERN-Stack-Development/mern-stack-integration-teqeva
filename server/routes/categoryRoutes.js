import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';

const router = express.Router();

// Note: Authentication/Authorization middleware will be added later
// to protect the POST route (only admins/authorized users should create categories).

router.route('/')
  .get(getCategories)      // GET /api/categories
  .post(createCategory);  // POST /api/categories (Requires auth/protection later)

export default router;