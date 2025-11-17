import axios from 'axios';

axios.defaults.withCredentials = true;

const CATEGORY_URL = '/api/categories';

// GET all categories
export const getCategories = async () => {
  const response = await axios.get(CATEGORY_URL);
  return response.data; 
};

// POST create new category (Note: This is typically admin-only)
export const createCategory = async (categoryData) => {
  const response = await axios.post(CATEGORY_URL, categoryData);
  return response.data;
};