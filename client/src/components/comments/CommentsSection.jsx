import { useEffect, useState } from 'react';
import { getComments } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import useApi from '../../hooks/useApi';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null); // The comment object being replied to
  
  const { data: fetchedComments, loading, error, request } = useApi();

  // 1. Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        await request({ url: `/comments/${postId}`, method: 'get' });
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchComments();
  }, [postId]);

  // 2. Set comments state once fetched data is available
  useEffect(() => {
    if (fetchedComments && Array.isArray(fetchedComments)) {
      setComments(fetchedComments);
    }
  }, [fetchedComments]);

  // 3. Handle a new comment submission
  const handleCommentSubmitted = (newComment, parent) => {
    // If it's a top-level comment
    if (!parent) {
      setComments(prev => [newComment, ...prev]); // Add to the top of the list
    } else {
      // If it's a reply, find the parent and add the reply to its replies array
      setComments(prevComments => {
        return prevComments.map(c => {
          if (c._id === parent._id) {
            // Ensure replies array exists and add the new comment
            return {
              ...c,
              replies: [...(c.replies || []), newComment] 
            };
          }
          return c;
        });
      });
      setReplyingTo(null); // Clear reply form
    }
  };

  // 4. Handle comment deletion
  const handleCommentDeleted = (deletedId) => {
    // Filter out the deleted comment from both top-level and nested replies
    const filterComments = (commentList) => {
      return commentList.filter(c => {
        if (c._id === deletedId) return false;
        // Recursively check replies
        if (c.replies) {
          c.replies = filterComments(c.replies);
        }
        return true;
      });
    };
    
    setComments(prev => filterComments(prev));
  };
  
  const handleReplyClick = (comment) => {
    setReplyingTo(comment);
  };
  
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6">
      <CommentForm 
        postId={postId} 
        onCommentSubmitted={handleCommentSubmitted} 
      />
      
      <h3 className="text-2xl font-bold text-gray-800">
        {comments.length} Comments
      </h3>
      
      {loading && <p className="text-gray-500">Loading comments...</p>}
      {error && <p className="text-red-600">Error loading comments.</p>}
      
      {!loading && comments.length === 0 && (
        <p className="text-gray-500">Be the first to comment!</p>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id}>
            <CommentItem 
              comment={comment} 
              postId={postId}
              onCommentDeleted={handleCommentDeleted}
              onReplyClick={handleReplyClick}
            />
            {/* Conditional Reply Form for this comment */}
            {replyingTo && replyingTo._id === comment._id && (
              <CommentForm
                postId={postId}
                parentComment={replyingTo}
                onCommentSubmitted={handleCommentSubmitted}
                onCancel={handleCancelReply}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;