import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/forms/PostForm';
import { createPost } from '../services/postService';

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreatePost = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createPost(formData);
      
      alert('Post created successfully!');
      // Redirect to the newly created post using its generated slug
      navigate(`/post/${response.data.slug}`); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create post. Check console for details.';
      setError(errorMessage);
      console.error('Post creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Blog Post</h1>
      
      {/* Display Loading/Error State */}
      {loading && <div className="text-center p-4 text-indigo-600">Creating post...</div>}
      {error && <div className="text-center p-4 bg-red-100 text-red-700 border border-red-300 rounded mb-4">Error: {error}</div>}

      <div className="bg-white p-8 shadow-xl rounded-lg">
        <PostForm 
          onSubmit={handleCreatePost} 
          submitText={loading ? 'Creating...' : 'Publish Post'} 
        />
      </div>
    </div>
  );
};

export default CreatePost;