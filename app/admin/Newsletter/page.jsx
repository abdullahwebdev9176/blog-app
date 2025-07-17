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
            <div className="admin-container">
                <div className="loading-spinner">
                    <FontAwesomeIcon icon={faRefresh} spin size="2x" />
                    <p>Loading newsletter data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Alerts */}
            <div className="alerts-container">
                {alerts.map(alert => (
                    <div key={alert.id} className={`alert alert-${alert.type}`}>
                        <FontAwesomeIcon 
                            icon={alert.type === 'success' ? faCheckCircle : faExclamationTriangle} 
                        />
                        {alert.message}
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="admin-header">
                <div className="header-content">
                    <h1>
                        <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
                        Newsletter Management
                    </h1>
                    <button 
                        className="btn btn-primary"
                        onClick={refreshData}
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faRefresh} spin={loading} />
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div className="stat-details">
                            <h3>{newsletterStats.totalSubscribers}</h3>
                            <p>Active Subscribers</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </div>
                        <div className="stat-details">
                            <h3>{newsletterStats.newslettersSent}</h3>
                            <p>Newsletters Sent</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div className="stat-details">
                            <h3>{newsletterStats.pendingNotifications}</h3>
                            <p>Pending Notifications</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                        <div className="stat-details">
                            <h3>{newsletterStats.totalBlogPosts}</h3>
                            <p>Total Blog Posts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Notifications */}
            <div className="admin-section">
                <div className="section-header">
                    <h2>
                        <FontAwesomeIcon icon={faClock} />
                        Pending Notifications
                    </h2>
                    <span className="badge">{pendingPosts.length}</span>
                </div>

                {pendingPosts.length === 0 ? (
                    <div className="empty-state">
                        <FontAwesomeIcon icon={faCheckCircle} size="3x" />
                        <h3>All caught up!</h3>
                        <p>No pending newsletter notifications. All blog posts have been sent to subscribers.</p>
                    </div>
                ) : (
                    <div className="card">
                        <div className="table-responsive">
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
                                                <div className="blog-title">
                                                    {post.title}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="author-badge">
                                                    {post.author}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="category-badge">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
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
                    </div>
                )}
            </div>

            {/* Recent Newsletters */}
            <div className="admin-section">
                <div className="section-header">
                    <h2>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Recent Newsletters
                    </h2>
                </div>

                {newsletterStats.recentNewsletters.length === 0 ? (
                    <div className="empty-state">
                        <FontAwesomeIcon icon={faEnvelope} size="3x" />
                        <h3>No newsletters sent yet</h3>
                        <p>Start creating blog posts to send newsletters to your subscribers.</p>
                    </div>
                ) : (
                    <div className="card">
                        <div className="table-responsive">
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
                                                <div className="blog-title">
                                                    {newsletter.title}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="author-badge">
                                                    {newsletter.author}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(newsletter.newsletterSentAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className="status-badge status-success">
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                    Sent Successfully
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterManagement;
