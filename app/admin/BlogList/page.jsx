'use client'

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faList, 
  faEdit, 
  faTrash, 
  faEye,
  faPlus,
  faSearch,
  faFilter,
  faCalendar,
  faUser,
  faTag
} from '@fortawesome/free-solid-svg-icons';

const BlogListPage = () => {
  const [blogs, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blog');
      setBlog(response.data.Blogs || []);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.allCategories || []);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/blog?id=${blogId}`);
        toast.success('Blog post deleted successfully');
        setBlog(prev => prev.filter(blog => blog._id !== blogId));
      } catch (err) {
        toast.error('Failed to delete blog post');
      }
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

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        Loading blog posts...
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
                Blog Posts
              </h1>
              <p style={{ 
                margin: '0.5rem 0 0', 
                color: 'var(--admin-text-secondary)',
                fontSize: '0.875rem'
              }}>
                Manage all your blog posts from here
              </p>
            </div>
            <a href="/admin/AddBlog" className="admin-btn admin-btn-primary">
              <FontAwesomeIcon icon={faPlus} />
              Add New Post
            </a>
          </div>
        </div>

        <div className="admin-card-body">
          {/* Search and Filter */}
          <div className="admin-search-bar">
            <div className="admin-search-input">
              <FontAwesomeIcon icon={faSearch} className="admin-search-icon" />
              <input
                type="text"
                className="admin-input"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="admin-filter-group">
              <FontAwesomeIcon icon={faFilter} style={{ color: 'var(--admin-text-secondary)' }} />
              <select
                className="admin-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ minWidth: '150px' }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </select>
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
              Showing {filteredBlogs.length} of {blogs.length} blog posts
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
                Total: {blogs.length} posts
              </span>
            </div>
          </div>

          {/* Blog Posts Table */}
          {filteredBlogs.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
                      Author
                    </th>
                    <th>Title</th>
                    <th>
                      <FontAwesomeIcon icon={faTag} style={{ marginRight: '0.5rem' }} />
                      Category
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faEye} style={{ marginRight: '0.5rem' }} />
                      Views
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '0.5rem' }} />
                      Date
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--admin-primary)', 
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            marginRight: '0.75rem'
                          }}>
                            {blog.author?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <span style={{ fontWeight: '500' }}>{blog.author}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                            {blog.title}
                          </div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--admin-text-secondary)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {blog.description?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No description'}...
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-secondary">
                          {blog.category}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FontAwesomeIcon icon={faEye} style={{ color: 'var(--admin-text-tertiary)' }} />
                          <span style={{ fontWeight: '500' }}>{blog.views || 0}</span>
                        </div>
                      </td>
                      <td style={{whiteSpace: 'nowrap'}}>{formatDate(blog.date || blog.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-primary"
                            onClick={() => router.push(`/admin/EditBlog/${blog._id}`)}
                            title="Edit blog post"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            onClick={() => handleDelete(blog._id)}
                            title="Delete blog post"
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
              <FontAwesomeIcon icon={faList} className="admin-empty-icon" />
              <h4 className="admin-empty-title">
                {searchTerm || filterCategory ? 'No posts found' : 'No blog posts yet'}
              </h4>
              <p className="admin-empty-description">
                {searchTerm || filterCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first blog post to get started'
                }
              </p>
              {!searchTerm && !filterCategory && (
                <a href="/admin/AddBlog" className="admin-btn admin-btn-primary">
                  <FontAwesomeIcon icon={faPlus} />
                  Create First Post
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogListPage;