import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required.'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters.'],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Link to the Post model
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Link to the User model
    required: true,
  },
  // Optional: For nested comments/replies
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null, // Null for top-level comments
  },
}, {
  timestamps: true,
});

// Virtual field for replies (for nested comment structure)
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  justOne: false,
});

// Middleware to automatically populate author and sort replies when querying
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'username avatar',
  });
  
  
  
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;