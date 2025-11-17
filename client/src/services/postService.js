import axios from 'axios';

axios.defaults.withCredentials = true;

const POST_URL = '/api/posts';

// GET all posts (with query params for searching/pagination)
export const getPosts = async (params = {}) => {
  const response = await axios.get(POST_URL, { params });
  return response.data; // Includes count and data array
};

// GET single post
export const getPost = async (slugOrId) => {
  const response = await axios.get(`${POST_URL}/${slugOrId}`);
  return response.data;
};

// POST create new post
export const createPost = async (postData) => {
  // Post data will be sent as FormData if it includes a file (image)
  const isFormData = postData instanceof FormData;
  
  const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
  
  const response = await axios.post(POST_URL, postData, { headers });
  return response.data;
};

// PUT update existing post
export const updatePost = async (id, postData) => {
  const isFormData = postData instanceof FormData;

  const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};

  const response = await axios.put(`${POST_URL}/${id}`, postData, { headers });
  return response.data;
};

// DELETE post
export const deletePost = async (id) => {
  const response = await axios.delete(`${POST_URL}/${id}`);
  return response.data;
};