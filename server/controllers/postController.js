import Post from '../models/Post.js';
import Category from '../models/Category.js';
import asyncHandler from 'express-async-handler'; // Used for async controllers

// Utility function for error handling
const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

// @desc    Get all blog posts (Will be updated for search/pagination next)
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find()
    .populate('author', 'username')
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// @desc    Get a single blog post
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username')
    .populate('category', 'name slug');

  if (!post) {
    return next(errorHandler(404, 'Post not found'));
  }

  // Increment views
  post.views += 1;
  await post.save();
  
  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Requires authentication)
export const createPost = asyncHandler(async (req, res, next) => {
  const { title, content, categoryId, tags } = req.body;
  
  // Get image path from Multer middleware
  const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
  
  if (!title || !content) {
    return next(errorHandler(400, 'Please provide both title and content.'));
  }

  const newPost = new Post({
    title,
    content,
    author: req.user._id, // Set by the 'protect' middleware
    category: categoryId,
    image: imagePath, // Use the path provided by multer or undefined
    tags,
  });

  const savedPost = await newPost.save();

  res.status(201).json({
    success: true,
    data: savedPost,
  });
});

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private (Requires authorization)
export const updatePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const updates = { ...req.body };
  
  // If a new file was uploaded, update the image path
  if (req.file) { 
    updates.image = `/uploads/${req.file.filename}`;
  } 

  let post = await Post.findById(postId);
  if (!post) {
    return next(errorHandler(404, 'Post not found'));
  }

  // Authorization check
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(errorHandler(403, 'User not authorized to update this post.'));
  }

  post = await Post.findByIdAndUpdate(postId, updates, {
    new: true,
    runValidators: true,
  }).populate('author', 'username');

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Requires authorization)
export const deletePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(errorHandler(404, 'Post not found'));
  }

  // Authorization check
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(errorHandler(403, 'User not authorized to delete this post.'));
  }

  await Post.deleteOne({ _id: postId });

  res.status(200).json({
    success: true,
    message: 'Post successfully deleted',
  });
});