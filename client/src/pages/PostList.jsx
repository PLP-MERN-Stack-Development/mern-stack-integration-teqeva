import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (!posts.length) return <p>No posts available</p>;

  return (
    <div>
      <h2>All Blog Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/post/${post._id}`}>
              <h3>{post.title}</h3>
              <p>Category: {post.category}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
