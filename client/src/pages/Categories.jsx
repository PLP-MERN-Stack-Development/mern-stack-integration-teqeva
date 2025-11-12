import React, { useEffect, useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      {categories.length === 0 ? <p>No categories yet</p> : (
        <ul>
          {categories.map(c => <li key={c._id}>{c.name}</li>)}
        </ul>
      )}
    </div>
  );
}

export default Categories;
