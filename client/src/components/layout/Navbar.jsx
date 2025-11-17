import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-indigo-400 transition">
          MERN Blog
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
          
          {user ? (
            <>
              <Link to="/create" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition">
                Create Post
              </Link>
              <span className="text-gray-300">Welcome, **{user.username}**</span>
              <button 
                onClick={handleLogout} 
                className="hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
              <Link to="/register" className="hover:text-indigo-400 transition">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;