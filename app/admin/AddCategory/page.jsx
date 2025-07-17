'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner, faTag } from '@fortawesome/free-solid-svg-icons';

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
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <h1 className="admin-card-title">
            <FontAwesomeIcon icon={faTag} style={{ marginRight: '0.5rem' }} />
            Add New Category
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0', 
            color: 'var(--admin-text-secondary)',
            fontSize: '0.875rem'
          }}>
            Create a new category to organize your blog posts
          </p>
        </div>
        
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="admin-form-group">
              <label className="admin-label">Category Title *</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Enter category title (e.g., Technology, Health, Travel)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div style={{ 
                marginTop: '0.5rem', 
                color: 'var(--admin-text-secondary)', 
                fontSize: '0.75rem' 
              }}>
                Choose a clear, descriptive name for your category
              </div>
            </div>

            {/* Preview */}
            {title && (
              <div style={{ 
                padding: '1rem',
                backgroundColor: 'var(--admin-bg-secondary)',
                borderRadius: 'var(--admin-radius-md)',
                border: '1px solid var(--admin-border-color)'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: 'var(--admin-text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem'
                }}>
                  Preview:
                </p>
                <span className="admin-badge admin-badge-secondary" style={{ fontSize: '0.875rem' }}>
                  {title}
                </span>
              </div>
            )}

          </form>
        </div>

        <div className="admin-card-footer">
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button 
              type="button" 
              className="admin-btn admin-btn-outline"
              onClick={() => setTitle('')}
              disabled={!title}
            >
              Clear
            </button>
            <button 
              type="submit" 
              className="admin-btn admin-btn-primary"
              disabled={loading || !title.trim()}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Creating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} />
                  Create Category
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;
