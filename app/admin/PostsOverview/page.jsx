'use client'

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFile, 
  faComments, 
  faEye, 
  faTags, 
  faChartBar, 
  faArrowUp,
  faArrowDown,
  faCalendar,
  faUser,
  faSync,
  faChartLine,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const PostsOverviewPage = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalBlogs: 0,
    totalComments: 0,
    totalViews: 0,
    totalCategories: 0,
    growth: {
      blogs: 0,
      comments: 0,
      views: 0,
      categories: 0
    },
    monthlyData: {
      currentMonth: {
        blogs: 0,
        comments: 0,
        views: 0,
        categories: 0
      }
    },
    recentActivity: {
      blogs: [],
      comments: []
    },
    topPerforming: {
      blogs: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard');
      
      if (response.data.success) {
        setDashboardStats(response.data.stats);
        setLastUpdated(new Date());
        toast.success('Dashboard updated successfully!');
      } else {
        toast.error('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'var(--admin-success)';
    if (growth < 0) return 'var(--admin-danger)';
    return 'var(--admin-text-secondary)';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return faArrowUp;
    if (growth < 0) return faArrowDown;
    return faArrowUp;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        Loading dashboard analytics...
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header Section */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>          <h1 style={{ margin: 0, color: 'var(--admin-text-primary)', fontSize: '1.75rem' }}>
            <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '0.75rem', color: 'var(--admin-primary)' }} />
            Posts Overview Dashboard
          </h1>
              <p style={{ 
                margin: '0.5rem 0 0', 
                color: 'var(--admin-text-secondary)',
                fontSize: '0.875rem'
              }}>
                Real-time analytics and insights for your blog content
              </p>
              {lastUpdated && (
                <p style={{ 
                  margin: '0.25rem 0 0', 
                  color: 'var(--admin-text-tertiary)',
                  fontSize: '0.75rem'
                }}>
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <button 
              className="admin-btn admin-btn-primary"
              onClick={fetchDashboardStats}
              disabled={loading}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faSync} />
              )}
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="admin-stats-grid">
        {/* Total Blog Posts */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Total Blog Posts</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-primary)' }}>
              <FontAwesomeIcon icon={faFile} />
            </div>
          </div>
          <p className="admin-stat-value">{formatNumber(dashboardStats.totalBlogs)}</p>
          <p className="admin-stat-change" style={{ color: getGrowthColor(dashboardStats.growth.blogs) }}>
            <FontAwesomeIcon icon={getGrowthIcon(dashboardStats.growth.blogs)} size="sm" />
            {Math.abs(dashboardStats.growth.blogs)}% from last month
          </p>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--admin-text-tertiary)',
            marginTop: '0.5rem'
          }}>
            {dashboardStats.monthlyData.currentMonth.blogs} posts this month
          </div>
        </div>

        {/* Total Comments */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Total Comments</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-success)' }}>
              <FontAwesomeIcon icon={faComments} />
            </div>
          </div>
          <p className="admin-stat-value">{formatNumber(dashboardStats.totalComments)}</p>
          <p className="admin-stat-change" style={{ color: getGrowthColor(dashboardStats.growth.comments) }}>
            <FontAwesomeIcon icon={getGrowthIcon(dashboardStats.growth.comments)} size="sm" />
            {Math.abs(dashboardStats.growth.comments)}% from last month
          </p>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--admin-text-tertiary)',
            marginTop: '0.5rem'
          }}>
            {dashboardStats.monthlyData.currentMonth.comments} comments this month
          </div>
        </div>

        {/* Total Views */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Total Views</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-info)' }}>
              <FontAwesomeIcon icon={faEye} />
            </div>
          </div>
          <p className="admin-stat-value">{formatNumber(dashboardStats.totalViews)}</p>
          <p className="admin-stat-change" style={{ color: getGrowthColor(dashboardStats.growth.views) }}>
            <FontAwesomeIcon icon={getGrowthIcon(dashboardStats.growth.views)} size="sm" />
            {Math.abs(dashboardStats.growth.views)}% from last month
          </p>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--admin-text-tertiary)',
            marginTop: '0.5rem'
          }}>
            {formatNumber(dashboardStats.monthlyData.currentMonth.views)} views this month
          </div>
        </div>

        {/* Total Categories */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Categories</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-warning)' }}>
              <FontAwesomeIcon icon={faTags} />
            </div>
          </div>
          <p className="admin-stat-value">{formatNumber(dashboardStats.totalCategories)}</p>
          <p className="admin-stat-change positive">
            <FontAwesomeIcon icon={faArrowUp} size="sm" />
            +{dashboardStats.growth.categories} new categories
          </p>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--admin-text-tertiary)',
            marginTop: '0.5rem'
          }}>
            {dashboardStats.monthlyData.currentMonth.categories} added this month
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Top Performing Posts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '0.5rem' }} />
              Top Performing Posts
            </h3>
            <p style={{ 
              margin: '0.5rem 0 0', 
              color: 'var(--admin-text-secondary)',
              fontSize: '0.875rem'
            }}>
              Posts ranked by total views
            </p>
          </div>
          <div className="admin-card-body">
            {dashboardStats.topPerforming.blogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dashboardStats.topPerforming.blogs.map((blog, index) => (
                  <div key={blog._id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: index === 0 ? 'rgba(79, 70, 229, 0.05)' : 'var(--admin-bg-secondary)',
                    borderRadius: 'var(--admin-radius-md)',
                    border: index === 0 ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid var(--admin-border-color)'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: index === 0 ? 'var(--admin-warning)' : 'var(--admin-primary)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </span>
                        <h4 style={{ 
                          margin: 0, 
                          fontWeight: 500, 
                          color: 'var(--admin-text-primary)',
                          fontSize: '0.875rem'
                        }}>
                          {blog.title}
                        </h4>
                      </div>
                      <p style={{ 
                        margin: 0, 
                        color: 'var(--admin-text-secondary)',
                        fontSize: '0.75rem'
                      }}>
                        By {blog.author} • {formatDate(blog.createdAt || blog.date)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FontAwesomeIcon icon={faEye} style={{ color: 'var(--admin-text-tertiary)', fontSize: '0.75rem' }} />
                      <span style={{ 
                        color: 'var(--admin-text-primary)', 
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {formatNumber(blog.views || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-state">
                <FontAwesomeIcon icon={faFile} className="admin-empty-icon" />
                <h4 className="admin-empty-title">No posts available</h4>
                <p className="admin-empty-description">Create your first blog post to see performance metrics</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '0.5rem' }} />
              Recent Activity
            </h3>
            <p style={{ 
              margin: '0.5rem 0 0', 
              color: 'var(--admin-text-secondary)',
              fontSize: '0.875rem'
            }}>
              Latest posts and comments
            </p>
          </div>
          <div className="admin-card-body">
            {dashboardStats.recentActivity.blogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h5 style={{ 
                  margin: '0 0 0.5rem', 
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  Recent Posts
                </h5>
                {dashboardStats.recentActivity.blogs.slice(0, 3).map((blog, index) => (
                  <div key={blog._id} style={{ 
                    padding: '0.75rem',
                    backgroundColor: 'var(--admin-bg-secondary)',
                    borderRadius: 'var(--admin-radius-sm)',
                    borderLeft: '3px solid var(--admin-primary)'
                  }}>
                    <p style={{ 
                      margin: '0 0 0.25rem', 
                      fontWeight: 500, 
                      color: 'var(--admin-text-primary)',
                      fontSize: '0.75rem'
                    }}>
                      {blog.title}
                    </p>
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--admin-text-secondary)',
                      fontSize: '0.7rem'
                    }}>
                      {formatDate(blog.createdAt || blog.date)}
                    </p>
                  </div>
                ))}
                
                {dashboardStats.recentActivity.comments.length > 0 && (
                  <>
                    <h5 style={{ 
                      margin: '1rem 0 0.5rem', 
                      color: 'var(--admin-text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      Recent Comments
                    </h5>
                    {dashboardStats.recentActivity.comments.slice(0, 2).map((comment, index) => (
                      <div key={comment._id} style={{ 
                        padding: '0.75rem',
                        backgroundColor: 'var(--admin-bg-secondary)',
                        borderRadius: 'var(--admin-radius-sm)',
                        borderLeft: '3px solid var(--admin-success)'
                      }}>
                        <p style={{ 
                          margin: '0 0 0.25rem', 
                          fontWeight: 500, 
                          color: 'var(--admin-text-primary)',
                          fontSize: '0.75rem'
                        }}>
                          {comment.name}
                        </p>
                        <p style={{ 
                          margin: '0 0 0.25rem', 
                          color: 'var(--admin-text-secondary)',
                          fontSize: '0.7rem',
                          lineHeight: '1.3'
                        }}>
                          {comment.comment?.substring(0, 60)}...
                        </p>
                        <p style={{ 
                          margin: 0, 
                          color: 'var(--admin-text-tertiary)',
                          fontSize: '0.65rem'
                        }}>
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="admin-empty-state">
                <FontAwesomeIcon icon={faCalendar} className="admin-empty-icon" />
                <h4 className="admin-empty-title">No recent activity</h4>
                <p className="admin-empty-description">Activity will appear here as you create content</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Growth Chart Placeholder */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '0.5rem' }} />
            Monthly Growth Summary
          </h3>
          <p style={{ 
            margin: '0.5rem 0 0', 
            color: 'var(--admin-text-secondary)',
            fontSize: '0.875rem'
          }}>
            Comparison of current month vs previous month performance
          </p>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'var(--admin-bg-secondary)',
              borderRadius: 'var(--admin-radius-md)',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--admin-primary)' }}>
                {dashboardStats.monthlyData.currentMonth.blogs}
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                Posts This Month
              </p>
            </div>
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'var(--admin-bg-secondary)',
              borderRadius: 'var(--admin-radius-md)',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--admin-success)' }}>
                {dashboardStats.monthlyData.currentMonth.comments}
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                Comments This Month
              </p>
            </div>
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'var(--admin-bg-secondary)',
              borderRadius: 'var(--admin-radius-md)',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--admin-info)' }}>
                {formatNumber(dashboardStats.monthlyData.currentMonth.views)}
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                Views This Month
              </p>
            </div>
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'var(--admin-bg-secondary)',
              borderRadius: 'var(--admin-radius-md)',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--admin-warning)' }}>
                {dashboardStats.monthlyData.currentMonth.categories}
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                Categories Added
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostsOverviewPage;
