'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const EditCategoryPage = () => {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const CategoryId = params.id;

  // Load existing category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // 👇 Get all categories first
        const res = await axios.get('/api/categories');
        const allCategories = res.data.allCategories;

        // 👇 Find this category by ID
        const currentCategory = allCategories.find(cat => cat._id === CategoryId);

        if (currentCategory) {
          setTitle(currentCategory.title);
        } else {
          toast.error('Category not found');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load category');
      }
    };

    if (CategoryId) {
      fetchCategory();
    }
  }, [CategoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 👇 Using query param
      const res = await axios.put(`/api/categories?id=${CategoryId}`, { title });

      if (res.data.success) {
        toast.success('Category updated successfully!');
        router.push('/admin/CategoryList'); // Redirect after update
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error updating category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Category Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Category'}
        </button>
      </form>
    </div>
  );
};

export default EditCategoryPage;
