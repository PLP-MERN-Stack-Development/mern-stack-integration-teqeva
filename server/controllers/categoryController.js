import Category from '../models/Category.js';

// Utility function for error handling
const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Admin/Requires authentication)
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return next(errorHandler(400, 'Category name is required.'));
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(errorHandler(409, `Category '${name}' already exists.`));
    }

    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      data: savedCategory,
    });
  } catch (err) {
    // Handle Mongoose validation or cast errors
    if (err.name === 'ValidationError') {
      return next(errorHandler(400, err.message));
    }
    next(err);
  }
};