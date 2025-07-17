'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faList, 
  faEdit, 
  faTrash, 
  faPlus,
  faTag,
  faCalendarAlt,
  faSearch,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/categories');
            setCategories(res.data.allCategories || []);
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
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

        try {
            await axios.delete(`/api/categories?id=${id}`);
            toast.success('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete category');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredCategories = categories.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                Loading categories...
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-card">
                <div className="admin-card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="admin-card-title">
                                <FontAwesomeIcon icon={faList} style={{ marginRight: '0.5rem' }} />
                                Categories
                            </h1>
                            <p style={{ 
                                margin: '0.5rem 0 0', 
                                color: 'var(--admin-text-secondary)',
                                fontSize: '0.875rem'
                            }}>
                                Manage blog categories to organize your content
                            </p>
                        </div>
                        <a href="/admin/AddCategory" className="admin-btn admin-btn-primary">
                            <FontAwesomeIcon icon={faPlus} />
                            Add Category
                        </a>
                    </div>
                </div>

                <div className="admin-card-body">
                    {/* Search */}
                    <div className="admin-search-bar">
                        <div className="admin-search-input">
                            <FontAwesomeIcon icon={faSearch} className="admin-search-icon" />
                            <input
                                type="text"
                                className="admin-input"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: 'var(--admin-bg-secondary)',
                        borderRadius: 'var(--admin-radius-md)'
                    }}>
                        <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
                            Showing {filteredCategories.length} of {categories.length} categories
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
                                Total: {categories.length} categories
                            </span>
                        </div>
                    </div>

                    {/* Categories Table */}
                    {filteredCategories.length > 0 ? (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>
                                            <FontAwesomeIcon icon={faTag} style={{ marginRight: '0.5rem' }} />
                                            Category Name
                                        </th>
                                        <th>
                                            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.5rem' }} />
                                            Created
                                        </th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map((category, index) => (
                                        <tr key={category._id}>
                                            <td>
                                                <span style={{ 
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--admin-primary)',
                                                    color: 'white',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ 
                                                        width: '32px', 
                                                        height: '32px', 
                                                        borderRadius: 'var(--admin-radius-md)', 
                                                        backgroundColor: 'var(--admin-bg-secondary)', 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <FontAwesomeIcon icon={faTag} style={{ color: 'var(--admin-primary)' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                                            {category.title}
                                                        </div>
                                                        <div style={{ 
                                                            fontSize: '0.75rem', 
                                                            color: 'var(--admin-text-secondary)' 
                                                        }}>
                                                            Category ID: {category._id.substring(0, 8)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{formatDate(category.createdAt)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="admin-btn admin-btn-sm admin-btn-primary"
                                                        onClick={() => router.push(`/admin/EditCategory/${category._id}`)}
                                                        title="Edit category"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        className="admin-btn admin-btn-sm admin-btn-danger"
                                                        onClick={() => handleDelete(category._id)}
                                                        title="Delete category"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="admin-empty-state">
                            <FontAwesomeIcon icon={faTag} className="admin-empty-icon" />
                            <h4 className="admin-empty-title">
                                {searchTerm ? 'No categories found' : 'No categories yet'}
                            </h4>
                            <p className="admin-empty-description">
                                {searchTerm 
                                    ? 'Try adjusting your search criteria'
                                    : 'Create your first category to organize your blog posts'
                                }
                            </p>
                            {!searchTerm && (
                                <a href="/admin/AddCategory" className="admin-btn admin-btn-primary">
                                    <FontAwesomeIcon icon={faPlus} />
                                    Create First Category
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
