import express from 'express';
import { 
  getCommentsByPost, 
  createComment, 
  deleteComment 
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET comments for a post
router.get('/:postId', getCommentsByPost); // GET /api/comments/:postId

// Create a new comment (requires auth)
router.post('/', protect, createComment); // POST /api/comments

// Delete a comment (requires auth)
router.delete('/:id', protect, deleteComment); // DELETE /api/comments/:id

export default router;