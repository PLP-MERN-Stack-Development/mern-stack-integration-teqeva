import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const imageUrl = post.image || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <Link to={`/post/${post.slug}`}>
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="w-full h-48 object-cover" 
        />
      </Link>
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          {post.category && (
            <span className="text-indigo-600 font-medium">{post.category.name}</span>
          )}
          <span>|</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-indigo-600 transition">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.preview}</p>
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span className="font-medium">
            By: {post.author ? post.author.username : 'Unknown'}
          </span>
          <Link 
            to={`/post/${post.slug}`} 
            className="text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            Read More &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;