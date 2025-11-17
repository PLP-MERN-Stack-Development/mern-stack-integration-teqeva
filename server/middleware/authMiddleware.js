import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

// Middleware to protect routes (require user authentication)
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'token' cookie
  token = req.cookies.token;

  if (token) {
    try {
      // Verify token and get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user data (excluding password) and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw errorHandler(401, 'Not authorized, user not found');
      }

      next();
    } catch (error) {
      // If token is invalid or expired
      res.status(401);
      throw errorHandler(401, 'Not authorized, token failed');
    }
  } else {
    // No token in cookies
    res.status(401);
    throw errorHandler(401, 'Not authorized, no token');
  }
});

// Middleware for authorization (require admin role)
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // Forbidden
    throw errorHandler(403, 'Not authorized as an admin');
  }
};