import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A post must have a title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
  },
  content: {
    type: String,
    required: [true, 'A post must have content'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (to be created in a later task)
    required: [true, 'A post must belong to a user'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: false, // Category is optional
  },
  image: {
    type: String, // URL of the uploaded image
    default: 'https://via.placeholder.com/600x400',
  },
  slug: String, // Unique identifier for URLs, generated pre-save
  tags: [String],
  views: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware to generate a slug before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title.toLowerCase().split(' ').join('-');
  }
  next();
});

// Virtual field for a short content preview
postSchema.virtual('preview').get(function() {
  return this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '');
});

const Post = mongoose.model('Post', postSchema);

export default Post;