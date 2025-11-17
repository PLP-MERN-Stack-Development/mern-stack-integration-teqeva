import express from 'express';
import { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost 
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js'; // <-- NEW IMPORT

const router = express.Router();

// Route for getting all posts and creating a new post
router.route('/')
  .get(getPosts)
  // Requires authentication AND file upload handling
  .post(protect, uploadImage, createPost); 

// Route for single post operations (get by ID, update, delete)
router.route('/:id')
  .get(getPostById)
  // Requires authentication, file upload handling, and authorization check within controller
  .put(protect, uploadImage, updatePost)
  .delete(protect, deletePost);

export default router;