'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faUsers, 
  faTrash, 
  faEye,
  faEyeSlash,
  faDownload,
  faSearch,
  faFilter,
  faCalendar,
  faSpinner,
  faPlus,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';

const SubscriptionPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchSubscribers = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        status
      });

      const response = await axios.get(`/api/admin/subscribers?${params}`);
      
      if (response.data.success) {
        setSubscribers(response.data.subscribers);
        setStats(response.data.stats);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete subscriber: ${email}?`)) {
      return;
    }

    try {
      setDeleting(id);
      await axios.delete(`/api/admin/subscribers?id=${id}`);
      toast.success('Subscriber deleted successfully');
      await fetchSubscribers(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      await axios.patch('/api/admin/subscribers', { id, action });
      toast.success(`Subscriber ${action}d successfully`);
      await fetchSubscribers(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast.error('Failed to update subscriber');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSubscribers(1, searchTerm, statusFilter);
  };

  const handleExport = async () => {
    try {
      // Create CSV content
      const csvContent = [
        ['Email', 'Status', 'Subscription Date', 'Source'],
        ...subscribers.map(sub => [
          sub.email,
          sub.isActive ? 'Active' : 'Inactive',
          new Date(sub.subscribedAt).toLocaleDateString(),
          sub.source || 'website'
        ])
      ].map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Subscribers exported successfully');
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      toast.error('Failed to export subscribers');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && subscribers.length === 0) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        Loading subscribers...
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, color: 'var(--admin-text-primary)', fontSize: '1.75rem' }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.75rem', color: 'var(--admin-primary)' }} />
                Newsletter Subscribers
              </h1>
              <p style={{ 
                margin: '0.5rem 0 0', 
                color: 'var(--admin-text-secondary)',
                fontSize: '0.875rem'
              }}>
                Manage your newsletter subscribers and view subscription analytics
              </p>
            </div>
            <button 
              className="admin-btn admin-btn-success"
              onClick={handleExport}
              disabled={subscribers.length === 0}
            >
              <FontAwesomeIcon icon={faDownload} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="admin-stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Total Subscribers</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-primary)' }}>
              <FontAwesomeIcon icon={faUsers} />
            </div>
          </div>
          <p className="admin-stat-value">{stats.total}</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
            All time subscribers
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Active Subscribers</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-success)' }}>
              <FontAwesomeIcon icon={faEye} />
            </div>
          </div>
          <p className="admin-stat-value">{stats.active}</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
            Currently subscribed
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">This Month</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-info)' }}>
              <FontAwesomeIcon icon={faCalendar} />
            </div>
          </div>
          <p className="admin-stat-value">{stats.thisMonth}</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
            New subscribers
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">Growth Rate</h3>
            <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-warning)' }}>
              <FontAwesomeIcon icon={faChartBar} />
            </div>
          </div>
          <p className="admin-stat-value">
            {stats.total > 0 ? Math.round((stats.thisMonth / stats.total) * 100) : 0}%
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
            Monthly growth
          </p>
        </div>
      </div>

      {/* Subscribers Management */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '0.5rem' }} />
            Manage Subscribers
          </h3>
        </div>

        <div className="admin-card-body">
          {/* Search and Filter */}
          <div className="admin-search-bar">
            <form onSubmit={handleSearch} className="admin-search-input">
              <FontAwesomeIcon icon={faSearch} className="admin-search-icon" />
              <input
                type="text"
                className="admin-input"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <div className="admin-filter-group">
              <FontAwesomeIcon icon={faFilter} style={{ color: 'var(--admin-text-secondary)' }} />
              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ minWidth: '120px' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              Showing {subscribers.length} subscribers
            </span>
            <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Subscribers Table */}
          {subscribers.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
                      Email Address
                    </th>
                    <th>Status</th>
                    <th>
                      <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '0.5rem' }} />
                      Subscription Date
                    </th>
                    <th>Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: subscriber.isActive ? 'var(--admin-success)' : 'var(--admin-secondary)', 
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem'
                          }}>
                            <FontAwesomeIcon icon={faEnvelope} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                              {subscriber.email}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-tertiary)' }}>
                              ID: {subscriber._id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${subscriber.isActive ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                          {subscriber.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{formatDate(subscriber.subscribedAt)}</td>
                      <td>
                        <span className="admin-badge admin-badge-info">
                          {subscriber.source || 'website'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className={`admin-btn admin-btn-sm ${subscriber.isActive ? 'admin-btn-warning' : 'admin-btn-success'}`}
                            onClick={() => handleStatusChange(subscriber._id, subscriber.isActive ? 'deactivate' : 'activate')}
                            title={subscriber.isActive ? 'Deactivate subscriber' : 'Activate subscriber'}
                          >
                            <FontAwesomeIcon icon={subscriber.isActive ? faEyeSlash : faEye} />
                          </button>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            onClick={() => handleDelete(subscriber._id, subscriber.email)}
                            disabled={deleting === subscriber._id}
                            title="Delete subscriber"
                          >
                            {deleting === subscriber._id ? (
                              <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                              <FontAwesomeIcon icon={faTrash} />
                            )}
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
              <FontAwesomeIcon icon={faEnvelope} className="admin-empty-icon" />
              <h4 className="admin-empty-title">No subscribers found</h4>
              <p className="admin-empty-description">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No subscribers match your search criteria'
                  : 'No newsletter subscribers yet. Start promoting your newsletter to get subscribers!'
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="admin-pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`admin-pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                className="admin-pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;