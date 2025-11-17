import { useState } from 'react';
import { createComment } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';

const CommentForm = ({ postId, parentComment = null, onCommentSubmitted, onCancel }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    const commentData = {
      content: content.trim(),
      postId,
      parentCommentId: parentComment ? parentComment._id : null,
    };

    try {
      const response = await createComment(commentData);
      
      // Notify parent component of the new comment
      onCommentSubmitted(response.data, parentComment);
      
      setContent(''); // Clear form
      if (onCancel) onCancel(); // Close reply form if applicable
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit comment.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className="text-center p-4 bg-gray-100 rounded-lg text-gray-600">
        You must be logged in to comment.
      </p>
    );
  }

  return (
    <div className={`p-4 ${parentComment ? 'mt-4 border border-indigo-200 rounded-lg bg-indigo-50' : 'bg-gray-100 rounded-lg'}`}>
      <h4 className="font-semibold text-lg mb-2">
        {parentComment ? `Replying to ${parentComment.author.username}` : 'Leave a Comment'}
      </h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={parentComment ? 3 : 5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={loading}
        />
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <div className="flex justify-end space-x-2">
          {parentComment && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;