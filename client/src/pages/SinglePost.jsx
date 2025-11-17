import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { getPost, deletePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import CommentsSection from '../components/comments/CommentsSection'; // <-- Integrated

const SinglePost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, loading, error, request, setData } = useApi();

  // Fetch the specific post when the component mounts or slug changes
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await request({ url: `/posts/${slug}`, method: 'get' });
        setData(response.data);
      } catch (err) {
        console.error('Error fetching single post:', err);
      }
    };
    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(post._id);
        alert('Post deleted successfully!');
        navigate('/'); 
      } catch (err) {
        alert('Failed to delete post. You may only delete your own posts.');
        console.error('Deletion error:', err);
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading post...</div>;
  if (error) return <div className="text-center py-12 text-red-600">Post not found or API error: {error}</div>;
  if (!post) return null;

  // Check if the current user is the author for displaying edit/delete buttons
  // Note: post.author is populated with '_id' and 'username' but not the full User object
  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-white p-8 shadow-xl rounded-lg">
        {/* Post Image */}
        <img 
          src={post.image || 'https://via.placeholder.com/1000x500?text=Featured+Image'} 
          alt={post.title} 
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            {post.title}
          </h1>
          
          {/* Action Buttons for Author */}
          {isAuthor && (
            <div className="flex space-x-3 mt-1">
              <Link
                to={`/edit/${post._id}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 text-sm"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="text-gray-500 text-sm mb-6 border-b pb-4">
          <span className="mr-4">By: **{post.author ? post.author.username : 'Unknown'}**</span>
          <span className="mr-4">Category: **{post.category ? post.category.name : 'None'}**</span>
          <span>Published: {new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="ml-4">Views: {post.views}</span>
        </div>

        {/* Post Content */}
        <div 
          className="prose max-w-none text-gray-800 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
      </div>
      
      {/* --- Comments Feature (Task 5) --- */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Comments</h2>
        <CommentsSection postId={post._id} /> 
      </div>
    </div>
  );
};

export default SinglePost;