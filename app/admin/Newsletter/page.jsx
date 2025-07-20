'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEnvelope, 
    faUsers, 
    faPaperPlane, 
    faEye, 
    faClock, 
    faCheckCircle, 
    faExclamationTriangle,
    faRefresh 
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '@/components/AdminStyles.css';

const NewsletterManagement = () => {
    const [newsletterStats, setNewsletterStats] = useState({
        totalSubscribers: 0,
        totalBlogPosts: 0,
        newslettersSent: 0,
        pendingNotifications: 0,
        recentNewsletters: []
    });
    const [pendingPosts, setPendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingNewsletter, setSendingNewsletter] = useState({});
    const [alerts, setAlerts] = useState([]);

    const showAlert = (message, type = 'success') => {
        const alert = { id: Date.now(), message, type };
        setAlerts(prev => [...prev, alert]);
        setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.id !== alert.id));
        }, 5000);
    };

    const fetchNewsletterStats = async () => {
        try {
            const response = await axios.get('/api/admin/newsletter?action=stats');
            if (response.data.success) {
                setNewsletterStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching newsletter stats:', error);
            showAlert('Failed to load newsletter statistics', 'error');
        }
    };

    const fetchPendingPosts = async () => {
        try {
            const response = await axios.get('/api/admin/newsletter?action=pending');
            if (response.data.success) {
                setPendingPosts(response.data.pendingPosts);
            }
        } catch (error) {
            console.error('Error fetching pending posts:', error);
            showAlert('Failed to load pending posts', 'error');
        }
    };

    const sendNewsletter = async (blogId) => {
        if (sendingNewsletter[blogId]) return;

        setSendingNewsletter(prev => ({ ...prev, [blogId]: true }));
        
        try {
            const response = await axios.post('/api/admin/newsletter', {
                blogId,
                action: 'send_newsletter'
            });

            if (response.data.success) {
                showAlert(response.data.message, 'success');
                // Refresh data
                await Promise.all([fetchNewsletterStats(), fetchPendingPosts()]);
            } else {
                showAlert(response.data.message || 'Failed to send newsletter', 'error');
            }
        } catch (error) {
            console.error('Error sending newsletter:', error);
            const message = error.response?.data?.message || 'Failed to send newsletter';
            showAlert(message, 'error');
        } finally {
            setSendingNewsletter(prev => ({ ...prev, [blogId]: false }));
        }
    };

    const refreshData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchNewsletterStats(), fetchPendingPosts()]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <div className="admin-spinner"></div>
                    Loading newsletter data...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Alerts */}
            {alerts.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    {alerts.map(alert => (
                        <div key={alert.id} className={`admin-alert admin-alert-${alert.type === 'success' ? 'success' : 'danger'}`}>
                            <FontAwesomeIcon 
                                icon={alert.type === 'success' ? faCheckCircle : faExclamationTriangle} 
                                className="admin-alert-icon"
                            />
                            {alert.message}
                        </div>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <div className="admin-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ margin: 0, color: 'var(--admin-text-primary)', fontSize: '1.75rem' }}>
                                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.75rem', color: 'var(--admin-primary)' }} />
                                Newsletter Management
                            </h1>
                            <p style={{ 
                                margin: '0.5rem 0 0', 
                                color: 'var(--admin-text-secondary)',
                                fontSize: '0.875rem'
                            }}>
                                Manage newsletter campaigns and subscriber notifications
                            </p>
                        </div>
                        <button 
                            className="admin-btn admin-btn-primary"
                            onClick={refreshData}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faRefresh} spin={loading} />
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="admin-stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="admin-stat-card">
                    <div className="admin-stat-header">
                        <h3 className="admin-stat-title">Active Subscribers</h3>
                        <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-info)' }}>
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                    </div>
                    <div className="admin-stat-value">{newsletterStats.totalSubscribers}</div>
                    <div className="admin-stat-change positive">
                        <FontAwesomeIcon icon={faUsers} style={{ marginRight: '0.25rem' }} />
                        Total active subscribers
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-header">
                        <h3 className="admin-stat-title">Newsletters Sent</h3>
                        <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-success)' }}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </div>
                    </div>
                    <div className="admin-stat-value">{newsletterStats.newslettersSent}</div>
                    <div className="admin-stat-change positive">
                        <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '0.25rem' }} />
                        Successfully delivered
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-header">
                        <h3 className="admin-stat-title">Pending Notifications</h3>
                        <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-warning)' }}>
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                    </div>
                    <div className="admin-stat-value">{newsletterStats.pendingNotifications}</div>
                    <div className="admin-stat-change" style={{ color: 'var(--admin-warning)' }}>
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.25rem' }} />
                        Awaiting newsletter
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-header">
                        <h3 className="admin-stat-title">Total Blog Posts</h3>
                        <div className="admin-stat-icon" style={{ backgroundColor: 'var(--admin-primary)' }}>
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                    </div>
                    <div className="admin-stat-value">{newsletterStats.totalBlogPosts}</div>
                    <div className="admin-stat-change positive">
                        <FontAwesomeIcon icon={faEye} style={{ marginRight: '0.25rem' }} />
                        Published content
                    </div>
                </div>
            </div>

            {/* Pending Notifications */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <div className="admin-card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 className="admin-card-title">
                                <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.5rem', color: 'var(--admin-warning)' }} />
                                Pending Notifications
                            </h2>
                            <p style={{ 
                                margin: '0.5rem 0 0', 
                                color: 'var(--admin-text-secondary)',
                                fontSize: '0.875rem'
                            }}>
                                Blog posts awaiting newsletter distribution
                            </p>
                        </div>
                        <div className="admin-badge admin-badge-warning">
                            {pendingPosts.length} Pending
                        </div>
                    </div>
                </div>

                <div className="admin-card-body">
                    {pendingPosts.length === 0 ? (
                        <div className="admin-empty-state">
                            <div className="admin-empty-icon">
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </div>
                            <h3 className="admin-empty-title">All caught up!</h3>
                            <p className="admin-empty-description">
                                No pending newsletter notifications. All blog posts have been sent to subscribers.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingPosts.map((post) => (
                                        <tr key={post._id}>
                                            <td>
                                                <div style={{ fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                                                    {post.title}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="admin-badge admin-badge-info">
                                                    {post.author}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="admin-badge admin-badge-success">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    className="admin-btn admin-btn-primary admin-btn-sm"
                                                    onClick={() => sendNewsletter(post._id)}
                                                    disabled={sendingNewsletter[post._id]}
                                                >
                                                    <FontAwesomeIcon 
                                                        icon={faPaperPlane} 
                                                        spin={sendingNewsletter[post._id]}
                                                    />
                                                    {sendingNewsletter[post._id] ? 'Sending...' : 'Send Newsletter'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Newsletters */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h2 className="admin-card-title">
                            <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '0.5rem', color: 'var(--admin-success)' }} />
                            Recent Newsletters
                        </h2>
                        <p style={{ 
                            margin: '0.5rem 0 0', 
                            color: 'var(--admin-text-secondary)',
                            fontSize: '0.875rem'
                        }}>
                            Recently sent newsletter campaigns
                        </p>
                    </div>
                </div>

                <div className="admin-card-body">
                    {newsletterStats.recentNewsletters.length === 0 ? (
                        <div className="admin-empty-state">
                            <div className="admin-empty-icon">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <h3 className="admin-empty-title">No newsletters sent yet</h3>
                            <p className="admin-empty-description">
                                Start creating blog posts to send newsletters to your subscribers.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Sent Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsletterStats.recentNewsletters.map((newsletter) => (
                                        <tr key={newsletter._id}>
                                            <td>
                                                <div style={{ fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                                                    {newsletter.title}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="admin-badge admin-badge-info">
                                                    {newsletter.author}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(newsletter.newsletterSentAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className="admin-badge admin-badge-success">
                                                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '0.25rem' }} />
                                                    Sent Successfully
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsletterManagement;
