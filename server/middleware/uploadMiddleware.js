import multer from 'multer';
import path from 'path';

// --- Storage Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save uploaded files to the 'uploads' folder in the project root (you must create this folder)
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename: fieldname-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// --- File Filter for Validation ---
const fileFilter = (req, file, cb) => {
  // Check if the file is an image (jpeg, png, jpg)
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accept file
  } else {
    // Reject file
    cb(new Error('Only image files (JPEG, PNG, JPG) are allowed!'), false);
  }
};

// --- Multer Configuration ---
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
});

// Middleware function to handle single image upload
// 'image' should match the field name in the frontend form (PostForm.jsx)
export const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred (e.g., file size limit)
            res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
        } else if (err) {
            // A custom error occurred (e.g., file type validation)
            res.status(400).json({ success: false, message: `Upload failed: ${err.message}` });
        } else {
            // Success or no file was uploaded
            next();
        }
    });
};