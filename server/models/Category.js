import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters'],
  },
  slug: String, // Unique identifier for URLs
}, {
  timestamps: true
});

// Middleware to generate a slug before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name.toLowerCase().split(' ').join('-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;