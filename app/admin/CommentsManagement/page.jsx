"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faTrash, faEye, faCalendarAlt, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./CommentsManagement.css";

const CommentsManagement = () => {
    const [comments, setComments] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedBlog, setSelectedBlog] = useState("all");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Fetch all comments and blogs
    useEffect(() => {
        fetchCommentsAndBlogs();
    }, []);

    const fetchCommentsAndBlogs = async () => {
        try {
            setLoading(true);
            
            // Fetch all comments
            const commentsRes = await axios.get("/api/comments/admin");
            
            // Fetch all blogs
            const blogsRes = await axios.get("/api/blog");
            
            setComments(commentsRes.data.comments || []);
            setBlogs(blogsRes.data.Blogs || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load comments and blogs");
        } finally {
            setLoading(false);
        }
    };

    // Get blog title by ID
    const getBlogTitle = (blogId) => {
        const blog = blogs.find(b => b._id === blogId);
        return blog ? blog.title : "Unknown Blog";
    };

    // Filter comments based on selected blog
    const filteredComments = selectedBlog === "all" 
        ? comments 
        : comments.filter(comment => comment.blogId === selectedBlog);

    // Delete comment
    const deleteComment = async (commentId) => {
        try {
            const res = await axios.delete(`/api/comments/admin?id=${commentId}`);
            
            if (res.data.success) {
                setComments(comments.filter(comment => comment._id !== commentId));
                setSuccess("Comment deleted successfully!");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            setError("Failed to delete comment");
            setTimeout(() => setError(""), 3000);
        }
        setDeleteConfirm(null);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="admin-comments-container">
                <div className="loading">Loading comments...</div>
            </div>
        );
    }

    return (
        <div className="admin-comments-container">
            <div className="admin-comment-management-header">
                <h1>
                    <FontAwesomeIcon icon={faComment} className="header-icon" />
                    Comments Management
                </h1>
                <p className="header-subtitle">
                    Manage all blog comments from one place
                </p>
            </div>

            {/* Filter Section */}
            <div className="filter-section">
                <div className="filter-group">
                    <label htmlFor="blogFilter">Filter by Blog:</label>
                    <select 
                        id="blogFilter"
                        value={selectedBlog}
                        onChange={(e) => setSelectedBlog(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Blogs ({comments.length} comments)</option>
                        {blogs.map(blog => {
                            const blogComments = comments.filter(c => c.blogId === blog._id);
                            return (
                                <option key={blog._id} value={blog._id}>
                                    {blog.title} ({blogComments.length} comments)
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Comments Stats */}
            <div className="stats-section">
                <div className="stat-card">
                    <div className="stat-number">{filteredComments.length}</div>
                    <div className="stat-label">
                        {selectedBlog === "all" ? "Total Comments" : "Comments in Selected Blog"}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{blogs.length}</div>
                    <div className="stat-label">Total Blogs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">
                        {filteredComments.filter(c => c.email).length}
                    </div>
                    <div className="stat-label">Comments with Email</div>
                </div>
            </div>

            {/* Comments Table */}
            <div className="comments-table-container">
                {filteredComments.length === 0 ? (
                    <div className="no-comments">
                        <FontAwesomeIcon icon={faComment} className="no-comments-icon" />
                        <p>No comments found for the selected filter.</p>
                    </div>
                ) : (
                    <div className="comments-table">
                        <div className="table-header">
                            <div className="header-cell">Blog Post</div>
                            <div className="header-cell">Commenter</div>
                            <div className="header-cell">Comment</div>
                            <div className="header-cell">Date</div>
                            <div className="header-cell">Actions</div>
                        </div>
                        
                        {filteredComments.map((comment, index) => (
                            <div key={comment._id || index} className="table-row">
                                <div className="table-cell blog-cell">
                                    <div className="blog-title">{getBlogTitle(comment.blogId)}</div>
                                </div>
                                
                                <div className="table-cell commenter-cell">
                                    <div className="commenter-info">
                                        <div className="commenter-name">
                                            {comment.name}
                                        </div>
                                        {comment.email && (
                                            <div className="commenter-email">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                                {comment.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="table-cell comment-cell">
                                    <div className="comment-text">
                                        {comment.text.length > 100 
                                            ? `${comment.text.substring(0, 100)}...` 
                                            : comment.text
                                        }
                                    </div>
                                </div>
                                
                                <div className="table-cell date-cell">
                                    <div className="comment-date">
                                        {formatDate(comment.createdAt)}
                                    </div>
                                </div>
                                
                                <div className="table-cell actions-cell">
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => setDeleteConfirm(comment._id)}
                                            className="delete-btn"
                                            title="Delete Comment"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <div className="status-badge">
                                            <span className={`status-indicator ${comment.status}`}>
                                                {comment.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => deleteComment(deleteConfirm)}
                                className="btn-delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentsManagement;
