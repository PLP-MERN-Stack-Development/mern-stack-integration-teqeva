import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/forms/PostForm';
import { getPost, updatePost } from '../services/postService';
import useApi from '../hooks/useApi';

const EditPost = () => {
  const { id } = useParams(); // Post ID is used for PUT request
  const navigate = useNavigate();
  
  // Custom hook to fetch the existing post data
  const { data: initialPost, loading: loadingPost, error: fetchError, request } = useApi();
  
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch the post data on component mount
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch the post using the ID (the backend route handles both ID and slug)
        await request({ url: `/posts/${id}`, method: 'get' });
      } catch (err) {
        console.error('Error fetching post for edit:', err);
      }
    };
    fetchPostData();
  }, [id]);

  const handleUpdatePost = async (formData) => {
    setLoadingUpdate(true);
    setUpdateError(null);
    try {
      const response = await updatePost(id, formData);
      
      alert('Post updated successfully!');
      // Redirect to the updated post using its current slug
      navigate(`/post/${response.data.slug}`); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update post. Check console for details.';
      setUpdateError(errorMessage);
      console.error('Post update error:', err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loadingPost) return <div className="text-center py-12">Loading post data...</div>;
  if (fetchError) return <div className="text-center py-12 text-red-600">Error fetching post: {fetchError}</div>;
  if (!initialPost) return <div className="text-center py-12 text-gray-500">Post not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Post: {initialPost.title}</h1>
      
      {/* Display Loading/Error State for update */}
      {loadingUpdate && <div className="text-center p-4 text-indigo-600">Updating post...</div>}
      {updateError && <div className="text-center p-4 bg-red-100 text-red-700 border border-red-300 rounded mb-4">Error: {updateError}</div>}

      <div className="bg-white p-8 shadow-xl rounded-lg">
        <PostForm 
          initialData={initialPost}
          onSubmit={handleUpdatePost} 
          submitText={loadingUpdate ? 'Updating...' : 'Save Changes'} 
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditPost;