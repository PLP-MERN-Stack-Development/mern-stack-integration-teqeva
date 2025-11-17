import axios from 'axios';

// Set up axios to send cookies (for HTTP-only token)
axios.defaults.withCredentials = true;

const AUTH_URL = '/api/users';

export const register = async (userData) => {
  const response = await axios.post(`${AUTH_URL}/register`, userData);
  // Backend returns user data and a JWT token (set as cookie)
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${AUTH_URL}/login`, userData);
  // Backend returns user data and sets a JWT cookie
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${AUTH_URL}/logout`, {});
  return response.data;
};