'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategoryPage = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/categories', { title });

      if (res.status === 201) {
        toast.success('Category created successfully!');
        setTitle('');
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Category Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryPage;
