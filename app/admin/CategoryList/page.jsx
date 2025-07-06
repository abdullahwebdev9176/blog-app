'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/categories');
            console.log(res.data)
            setCategories(res.data.allCategories);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Delete category
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await axios.delete(`/api/categories/${id}`);
            toast.success('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete category');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">All Categories</h2>
            {loading ? (
                <p>Loading...</p>
            ) : categories.length === 0 ? (
                <p>No categories found.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category._id}>
                                <td>{index + 1}</td>
                                <td>{category.title}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => toast.info('Edit functionality coming soon!')}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(category._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CategoriesPage;
