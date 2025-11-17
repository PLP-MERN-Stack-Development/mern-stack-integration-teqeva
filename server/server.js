import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
connectDB();

// --- Middleware ---
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static File Serving for Uploads (NEW) ---
// Frontend accesses images via URL like http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static('uploads')); 

// --- Routes ---
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

// --- Basic Health Check Route ---
app.get('/', (req, res) => {
  res.send('MERN Blog API is running...');
});

// --- Global Error Handler Middleware ---
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));