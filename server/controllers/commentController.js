import Comment from '../models/Comment.js';
import asyncHandler from 'express-async-handler';

// Utility function for error handling (using the pattern defined earlier)
const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

// @desc    Get all comments for a specific post
// @route   GET /api/comments/:postId
// @access  Public
export const getCommentsByPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  // Find all top-level comments for the post, sorted by creation date
  const comments = await Comment.find({ post: postId, parentComment: null })
    .sort({ createdAt: 1 })
    // Explicitly populate replies (up to one level deep for simplicity)
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'username avatar'
      }
    });

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private (Requires authentication)
export const createComment = asyncHandler(async (req, res, next) => {
  const { content, postId, parentCommentId } = req.body;
  
  if (!content || !postId) {
    return next(errorHandler(400, 'Content and Post ID are required.'));
  }

  const newComment = new Comment({
    content,
    post: postId,
    author: req.user._id, // Set by the 'protect' middleware
    parentComment: parentCommentId || null,
  });

  const savedComment = await newComment.save();
  
  // Re-fetch the saved comment to get populated author data for the response
  const populatedComment = await Comment.findById(savedComment._id);

  res.status(201).json({
    success: true,
    data: populatedComment,
  });
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Author or Admin)
export const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(errorHandler(404, 'Comment not found.'));
  }

  // Check authorization: Must be the author or an Admin
  const isAuthorized = comment.author._id.toString() === req.user._id.toString() || req.user.role === 'admin';

  if (!isAuthorized) {
    return next(errorHandler(403, 'Not authorized to delete this comment.'));
  }

  // Delete the comment and any direct replies (nested deletion logic)
  await Comment.deleteMany({ parentComment: comment._id });
  await Comment.deleteOne({ _id: comment._id });
  
  res.status(200).json({
    success: true,
    message: 'Comment and its replies deleted.',
  });
});