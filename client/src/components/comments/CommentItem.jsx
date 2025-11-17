import { useAuth } from '../../context/AuthContext';
import { deleteComment } from '../../services/commentService';
import { useState } from 'react';

const CommentItem = ({ comment, postId, onCommentDeleted, onReplyClick }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if the current user is the author or an admin
  const isAuthor = user && comment.author && user._id === comment.author._id;
  const isAdmin = user && user.role === 'admin';
  const canDelete = isAuthor || isAdmin;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteComment(comment._id);
      onCommentDeleted(comment._id); // Notify parent to update state
    } catch (err) {
      alert('Failed to delete comment. You may only delete your own comments.');
      console.error('Delete comment error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${comment.parentComment ? 'ml-8 bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}`}>
      <div className="flex items-center space-x-3 mb-2">
        <img 
          src={comment.author.avatar || 'https://via.placeholder.com/40'} 
          alt={comment.author.username} 
          className="w-8 h-8 rounded-full object-cover" 
        />
        <div>
          <p className="font-semibold text-gray-900">{comment.author.username}</p>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 mt-2 whitespace-pre-line">{comment.content}</p>

      <div className="flex items-center space-x-3 mt-3 text-sm">
        {user && (
          <button 
            onClick={() => onReplyClick(comment)} 
            className="text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            Reply
          </button>
        )}
        
        {canDelete && (
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 font-medium transition disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {/* Render Replies Recursively (up to one level deep for simplicity as per model) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              postId={postId}
              onCommentDeleted={onCommentDeleted}
              // Don't allow nested replies beyond 1 level
              onReplyClick={() => onReplyClick(comment)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;