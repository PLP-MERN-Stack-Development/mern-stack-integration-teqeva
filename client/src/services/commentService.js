import axios from 'axios';

axios.defaults.withCredentials = true;

const COMMENT_URL = '/api/comments';

// GET comments for a specific post
export const getComments = async (postId) => {
  // GET /api/comments/:postId
  const response = await axios.get(`${COMMENT_URL}/${postId}`);
  return response.data; // Returns { success: true, count: N, data: [...] }
};

// POST create a new comment
export const createComment = async (commentData) => {
  // POST /api/comments (commentData includes postId, content, parentCommentId)
  const response = await axios.post(COMMENT_URL, commentData);
  return response.data; // Returns the newly created comment
};

// DELETE a comment
export const deleteComment = async (commentId) => {
  // DELETE /api/comments/:id
  const response = await axios.delete(`${COMMENT_URL}/${commentId}`);
  return response.data;
};