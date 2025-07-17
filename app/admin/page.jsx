'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileText, 
  faComments, 
  faEye, 
  faTags, 
  faChartLine, 
  faUsers,
  faCalendarAlt,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalComments: 0,
    totalViews: 0,
    totalCategories: 0,
    recentBlogs: [],
    recentComments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [blogsRes, commentsRes, categoriesRes] = await Promise.all([
        axios.get('/api/blog'),
        axios.get('/api/admin/comments'),
        axios.get('/api/categories')
      ]);

      const blogs = blogsRes.data.Blogs || [];
      const comments = commentsRes.data.comments || [];
      const categories = categoriesRes.data.allCategories || [];

      // Calculate total views
      const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);

      // Get recent blogs (last 5)
      const recentBlogs = blogs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Get recent comments (last 5)
      const recentComments = comments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalBlogs: blogs.length,
        totalComments: comments.length,
        totalViews,
        totalCategories: categories.length,
        recentBlogs,
        recentComments
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--admin-text-primary)' }}>Welcome back, Admin!</h2>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--admin-text-secondary)' }}>
                Here's what's happening with your blog today.
              </p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <FontAwesomeIcon 
                icon={faChartLine} 
                style={{ fontSize: '2rem', color: 'var(--admin-primary)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Total Blog Posts</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-primary)' }}>
              <FontAwesomeIcon icon={faFileText} />
            </div>
          </div>
          <p className="admin-stat-value">{formatNumber(stats.totalBlogs)}</p>
          <p className="admin-stat-change positive">
            <FontAwesomeIcon icon={faArrowUp} size="sm" /> +12% from last month
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Total Comments</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-success)' }}>
              <FontAwesomeIcon icon={faComments} />
            </div>
          </div>
          <p className="admin-stat-value">{formatNumber(stats.totalComments)}</p>
          <p className="admin-stat-change positive">
            <FontAwesomeIcon icon={faArrowUp} size="sm" /> +8% from last month
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Total Views</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-info)' }}>
              <FontAwesomeIcon icon={faEye} />
            </div>
          </div>
          <p className="admin-stat-value">{formatNumber(stats.totalViews)}</p>
          <p className="admin-stat-change positive">
            <FontAwesomeIcon icon={faArrowUp} size="sm" /> +15% from last month
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Categories</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-warning)' }}>
              <FontAwesomeIcon icon={faTags} />
            </div>
          </div>
          <p className="admin-stat-value">{formatNumber(stats.totalCategories)}</p>
          <p className="admin-stat-change positive">
            <FontAwesomeIcon icon={faArrowUp} size="sm" /> +2 new categories
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Recent Blog Posts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Recent Blog Posts</h3>
          </div>
          <div className="admin-card-body">
            {stats.recentBlogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.recentBlogs.map((blog, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingBottom: '1rem',
                    borderBottom: index !== stats.recentBlogs.length - 1 ? '1px solid var(--admin-border-color)' : 'none'
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        margin: 0, 
                        fontWeight: 500, 
                        color: 'var(--admin-text-primary)',
                        fontSize: '0.875rem'
                      }}>
                        {blog.title}
                      </p>
                      <p style={{ 
                        margin: '0.25rem 0 0', 
                        color: 'var(--admin-text-secondary)',
                        fontSize: '0.75rem'
                      }}>
                        By {blog.author} • {formatDate(blog.createdAt)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FontAwesomeIcon icon={faEye} style={{ color: 'var(--admin-text-tertiary)', fontSize: '0.75rem' }} />
                      <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.75rem' }}>
                        {blog.views || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-state">
                <FontAwesomeIcon icon={faFileText} className="admin-empty-icon" />
                <h4 className="admin-empty-title">No blog posts yet</h4>
                <p className="admin-empty-description">Start by creating your first blog post</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Recent Comments</h3>
          </div>
          <div className="admin-card-body">
            {stats.recentComments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.recentComments.map((comment, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    paddingBottom: '1rem',
                    borderBottom: index !== stats.recentComments.length - 1 ? '1px solid var(--admin-border-color)' : 'none'
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        margin: 0, 
                        fontWeight: 500, 
                        color: 'var(--admin-text-primary)',
                        fontSize: '0.875rem'
                      }}>
                        {comment.name}
                      </p>
                      <p style={{ 
                        margin: '0.25rem 0', 
                        color: 'var(--admin-text-secondary)',
                        fontSize: '0.75rem',
                        lineHeight: '1.4'
                      }}>
                        {comment.comment?.substring(0, 100)}...
                      </p>
                      <p style={{ 
                        margin: 0, 
                        color: 'var(--admin-text-tertiary)',
                        fontSize: '0.75rem'
                      }}>
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <span className={`admin-badge admin-badge-${comment.status === 'approved' ? 'success' : comment.status === 'pending' ? 'warning' : 'secondary'}`}>
                      {comment.status || 'pending'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-state">
                <FontAwesomeIcon icon={faComments} className="admin-empty-icon" />
                <h4 className="admin-empty-title">No comments yet</h4>
                <p className="admin-empty-description">Comments will appear here when readers engage with your posts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card" style={{ marginTop: '2rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quick Actions</h3>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <a href="/admin/AddBlog" className="admin-btn admin-btn-primary">
              <FontAwesomeIcon icon={faFileText} />
              Create New Post
            </a>
            <a href="/admin/AddCategory" className="admin-btn admin-btn-secondary">
              <FontAwesomeIcon icon={faTags} />
              Add Category
            </a>
            <a href="/admin/CommentsManagement" className="admin-btn admin-btn-success">
              <FontAwesomeIcon icon={faComments} />
              Manage Comments
            </a>
            <a href="/admin/PostsOverview" className="admin-btn admin-btn-info">
              <FontAwesomeIcon icon={faChartLine} />
              View Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;