import { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { getPosts } from '../services/postService';
import PostCard from '../components/common/PostCard';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data, loading, error, request } = useApi();

  useEffect(() => {
    // We'll update the backend to handle these query parameters later
    const fetchPosts = async () => {
      try {
        const response = await request({ 
          url: `/posts?page=${currentPage}&search=${searchQuery}&category=${categoryFilter}`, 
          method: 'get' 
        });
        
        // Assuming backend sends { data: [...], totalPages: N, count: M }
        if (response && response.data) {
          setPosts(response.data);
          // Placeholder for pagination data
          // setTotalPages(response.totalPages || 1); 
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
    fetchPosts();
  }, [currentPage, searchQuery, categoryFilter]); // Dependencies for re-fetching

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="text-center py-10">Loading posts...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (posts.length === 0) return <div className="text-center py-10 text-gray-500">No posts found.</div>;

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Blog Posts</h1>

      {/* Placeholder for Search, Filter, and Pagination */}
      <div className="mb-8 p-4 bg-white shadow rounded-lg flex justify-between items-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset page on new search
          }}
          className="border p-2 rounded w-1/3"
        />
        
        {/* Filter Dropdown (Categories will be fetched later) */}
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {/* Category options will map here */}
        </select>

        {/* Pagination Controls */}
        <div className="space-x-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostList;