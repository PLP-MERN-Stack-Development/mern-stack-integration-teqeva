import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(true);

  // Function to set the user state and update local storage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to clear user state and local storage
  const logout = async () => {
    // Call the logout API endpoint to clear the HTTP-only cookie
    try {
      await axios.post('/api/users/logout', {});
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check user status on initial load (optional, for persistent login)
  useEffect(() => {
    // If a user exists in localStorage, we assume they're logged in 
    // and rely on the backend's HTTP-only cookie for session validity
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);