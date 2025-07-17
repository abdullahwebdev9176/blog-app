// components/BlogDetails.jsx
"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faEye, faComment } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./BlogDetails.css";

const BlogDetails = ({ blog }) => {
    if (!blog) {
        console.error("Blog prop is missing or undefined.");
        return <p>Loading...</p>;
    }

    // Comment section state
    const [comments, setComments] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Like state
    const [likes, setLikes] = useState(blog.likes || 0);
    const [liked, setLiked] = useState(false);
    
    // View state
    const [views, setViews] = useState(blog.views || 0);

    useEffect(() => {
        console.log("Blog data on load:", blog);
    }, [blog]);

    // Fetch comments for this blog
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`/api/comments?blogId=${blog._id}`);
                const commentsData = res.data.comments || [];
                // Sort comments by createdAt in descending order (latest first)
                const sortedComments = commentsData.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setComments(sortedComments);
            } catch (error) {
                console.error("Error fetching comments:", error);
                setComments([]);
            }
        };
        
        if (blog._id) {
            fetchComments();
        }
    }, [blog._id]);

    // Check localStorage for liked state
    useEffect(() => {
        const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs")) || [];
        if (likedBlogs.includes(blog._id)) {
            setLiked(true);
        }
    }, [blog._id]);

    // Increment view count for the blog (unique per user)
    useEffect(() => {
        const incrementViewCount = async () => {
            try {
                const viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs")) || [];
                
                // Check if this blog has already been viewed by this user
                if (!viewedBlogs.includes(blog._id)) {
                    // Make API call to increment view count
                    const response = await axios.patch("/api/blog", { blogId: blog._id });
                    
                    if (response.data.success) {
                        // Update local state with new view count
                        setViews(response.data.views);
                        
                        // Mark this blog as viewed in localStorage
                        viewedBlogs.push(blog._id);
                        localStorage.setItem("viewedBlogs", JSON.stringify(viewedBlogs));
                        
                        console.log(`View count updated for blog ${blog._id}: ${response.data.views}`);
                    }
                }
            } catch (error) {
                console.error("Error updating view count:", error);
            }
        };

        if (blog._id) {
            incrementViewCount();
        }
    }, [blog._id]);

    // Handle new comment submit
    const handleComment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        
        // Basic validation
        if (!name.trim()) {
            setError("Please enter your name.");
            setLoading(false);
            return;
        }
        
        if (!text.trim()) {
            setError("Please enter your comment.");
            setLoading(false);
            return;
        }
        
        if (email && !isValidEmail(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }
        
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    blogId: blog._id, 
                    name: name.trim(), 
                    email: email.trim(),
                    text: text.trim() 
                })
            });
            
            if (!res.ok) {
                throw new Error("Failed to add comment");
            }
            
            const data = await res.json();
            
            // Add new comment to the beginning of the array (latest first)
            setComments([data.comment, ...comments]);
            setName("");
            setEmail("");
            setText("");
            setSuccess("Comment added successfully!");
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
            
        } catch (error) {
            console.error("Error adding comment:", error);
            setError("Failed to add comment. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    // Email validation helper function
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Handle like button click
    const handleLikeToggle = async () => {
        try {
            const action = liked ? "unlike" : "like";
            const res = await axios.post("/api/blog", { blogId: blog._id, action });

            if (res.data.success) {
                setLikes(res.data.likes);
                setLiked(!liked);
                
                // Update localStorage to persist liked state
                const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs")) || [];
                if (!liked) {
                    // Adding like
                    if (!likedBlogs.includes(blog._id)) {
                        likedBlogs.push(blog._id);
                    }
                } else {
                    // Removing like
                    const index = likedBlogs.indexOf(blog._id);
                    if (index > -1) {
                        likedBlogs.splice(index, 1);
                    }
                }
                localStorage.setItem("likedBlogs", JSON.stringify(likedBlogs));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <>
            <div className="details-container">
                {/* Defensive check for blog.image */}
                {blog.image ? (
                    <div className="blog-details-img">
                        <img src={blog.image} alt={blog.title} className="blog-image" />
                    </div>
                ) : (
                    <p>No image available for this blog.</p>
                )}

                <div className="blog-content">
                    <p>
                        <b>Category:</b> {blog.category || "Unknown"} <br />
                        <b>Author:</b> {blog.author || "Unknown"}
                    </p>
                    <h2>{blog.title || "Untitled Blog"}</h2>
                    <div
                        className="blog-description"
                        dangerouslySetInnerHTML={{ __html: blog.description || "No description available." }}
                    />
                </div>

                {/* Stats Bar */}
                <div className="stats-bar">
                    <div>
                        <button onClick={handleLikeToggle} className="like-button">
                            <FontAwesomeIcon icon={faThumbsUp} style={{ color: liked ? "blue" : "white" }} />
                            {`Likes ${likes}`}
                        </button>
                    </div>
                    <div className="view-count">
                        <FontAwesomeIcon icon={faEye} /> 
                        <span>{views} Views</span>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faComment} /> 
                        <span>{comments.length} Comments</span>
                    </div>
                </div>
            </div>

            <hr className="divider" />

            {/* Comment Section */}
            <div className="comments-section">
                <h3 className="comments-header">
                    <FontAwesomeIcon icon={faComment} className="comment-icon" />
                    Comments ({comments.length})
                </h3>
                
                {/* Comment Form */}
                <div className="comment-form-container">
                    <h4 className="form-title">Leave a Comment</h4>
                    <form onSubmit={handleComment} className="comment-form">
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Your Name *"
                                    value={name}
                                    className="form-control"
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Your Email (Optional)"
                                    value={email}
                                    className="form-control"
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Your Comment *"
                                value={text}
                                className="form-control comment-textarea"
                                onChange={e => setText(e.target.value)}
                                rows="4"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Posting..." : "Post Comment"}
                        </button>
                    </form>
                    
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                </div>
                
                {/* Comments List */}
                <div className="comments-list">
                    <h4 className="comments-list-title">
                        {comments.length > 0 ? `${comments.length} Comments` : "No Comments Yet"}
                    </h4>
                    
                    {comments.length === 0 ? (
                        <div className="no-comments">
                            <p>Be the first to comment on this blog post!</p>
                        </div>
                    ) : (
                        <div className="comments-container">
                            {comments.map((comment, index) => (
                                <div key={comment._id || comment.id || index} className="comment-item">
                                    <div className="comment-header">
                                        <div className="comment-author">
                                            <span className="author-name">{comment.name}</span>
                                            {comment.email && (
                                                <span className="author-email">({comment.email})</span>
                                            )}
                                        </div>
                                        <div className="comment-date">
                                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div className="comment-text">{comment.text}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogDetails;
