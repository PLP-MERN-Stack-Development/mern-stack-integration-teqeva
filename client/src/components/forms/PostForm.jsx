import { useState, useEffect } from 'react';
import { getCategories } from '../../services/categoryService'; // Need to create this service later

const PostForm = ({ initialData = {}, onSubmit, submitText, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    category: initialData.category?._id || '', // Use ID for form submission
    imageFile: null,
    currentImage: initialData.image || '',
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState({});

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // NOTE: We need to create client/src/services/categoryService.js 
        // before this function will work correctly.
        const response = await getCategories(); 
        setCategories(response.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const validate = () => {
    let formErrors = {};
    if (!formData.title.trim()) formErrors.title = 'Title is required.';
    if (formData.title.length < 5) formErrors.title = 'Title must be at least 5 characters.';
    if (!formData.content.trim()) formErrors.content = 'Content is required.';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Create FormData object to handle text fields and the file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (formData.category) {
        data.append('categoryId', formData.category);
      }
      
      // Append file only if a new file is selected
      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      } else if (isEdit && formData.currentImage) {
        // If editing and no new file, send the current image URL
        data.append('image', formData.currentImage);
      }
      
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Content Textarea */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          id="content"
          name="content"
          rows="10"
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
      </div>

      {/* Category Dropdown */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a Category (Optional)</option>
          {loadingCategories ? (
            <option disabled>Loading categories...</option>
          ) : (
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))
          )}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Featured Image</label>
        {formData.currentImage && (
          <p className="text-sm text-gray-500 mb-2">Current Image: <a href={formData.currentImage} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">View</a></p>
        )}
        <input
          type="file"
          id="imageFile"
          name="imageFile"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {submitText}
      </button>
    </form>
  );
};

export default PostForm;