// components/BlogDetails.jsx
"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faEye, faComment } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./BlogDetails.css";

const BlogDetails = ({ blog }) => {
    if (!blog) return <p>Loading...</p>;

    // Comment section state
    const [comments, setComments] = useState([]);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Like state
    const [likes, setLikes] = useState(blog.likes || 0);
    const [liked, setLiked] = useState(false);

    // Fetch comments for this blog
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comments?blogId=${blog._id}`);
                const data = await res.json();
                setComments(data.comments || []);
            } catch {
                setComments([]);
            }
        };
        if (blog._id) fetchComments();
    }, [blog._id]);

    // Check localStorage for liked state
    useEffect(() => {
        const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs")) || [];
        if (likedBlogs.includes(blog._id)) {
            setLiked(true);
        }
    }, [blog._id]);

    // Increment view count for the blog
    useEffect(() => {
        const viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs")) || [];

        if (!viewedBlogs.includes(blog._id)) {
            axios.patch("/api/blog", { blogId: blog._id })
                .then(() => {
                    viewedBlogs.push(blog._id);
                    localStorage.setItem("viewedBlogs", JSON.stringify(viewedBlogs));
                })
                .catch(err => console.error("Error updating views:", err));
        }
    }, [blog._id]);

    // Fetch comments count
    useEffect(() => {
        const fetchCommentsCount = async () => {
            try {
                const res = await axios.get(`/api/comments?blogId=${blog._id}`);
                setComments(res.data.comments || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        if (blog._id) fetchCommentsCount();
    }, [blog._id]);

    // Handle new comment submit
    const handleComment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blogId: blog._id, name, text })
            });
            if (!res.ok) throw new Error("Failed to add comment");
            const data = await res.json();
            setComments([data.comment, ...comments]);
            setName("");
            setText("");
        } catch {
            setError("Comment add nahi hua. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle like button click
    const handleLikeToggle = async () => {
        try {
            const action = liked ? "unlike" : "like";
            const res = await axios.post("/api/blog", { blogId: blog._id, action });

            setLikes(res.data.likes);
            setLiked(!liked);
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <>
            <div className="details-container">
                <div className="blog-details-img">
                    <img src={blog.image} alt={blog.title} className="blog-image" />
                </div>
                <div className="blog-content">
                    <p>
                        <b>Category:</b> {blog.category} <br />
                        <b>Author:</b> {blog.author}
                    </p>
                    <h2>{blog.title}</h2>
                    <div className="blog-description" dangerouslySetInnerHTML={{ __html: blog.description }} />
                </div>

                {/* Stats Bar */}
                <div className="stats-bar">
                    <div>
                        <button onClick={handleLikeToggle} className="like-button">
                            <FontAwesomeIcon icon={faThumbsUp} style={{ color: liked ? "blue" : "white" }} />
                            {`Likes ${likes}`}
                        </button>
                    </div>
                    <div><FontAwesomeIcon icon={faEye} /> {blog.views} Views</div>
                    <div><FontAwesomeIcon icon={faComment} /> {comments.length} Comments</div>
                </div>
            </div>

            <hr className="divider" />

            {/* Comment Section */}
            <div className="comments-section">
                <h3 className="comments-header">Comments</h3>
                <form onSubmit={handleComment} className="form-box">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        className="form-control"
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Your Comment"
                        value={text}
                        className="form-control"
                        onChange={e => setText(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Posting..." : "Add Comment"}
                    </button>
                </form>
                {error && <div className="error-message">{error}</div>}
                <div>
                    {comments.length === 0 && <p className="no-comments">No comments yet.</p>}
                    {comments.map(c => (
                        <div key={c.id} className="comment-item">
                            <b className="comment-author">{c.name}</b> <br /> <span className="comment-date">{new Date(c.createdAt).toLocaleString()}</span>
                            <div className="comment-text">{c.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BlogDetails;
