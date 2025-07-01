// components/BlogDetails.jsx
"use client";
import { useEffect, useState } from "react";

const BlogDetails = ({ blog }) => {
    if (!blog) return <p>Loading...</p>;

    // Comment section state
    const [comments, setComments] = useState([]);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    return (
        <>
            <div className="details-container">
                <div className="blog-details-img">
                    {/* Use img tag for dynamic URLs */}
                    <img src={blog.image} alt={blog.title}/>
                </div>
                <div className="blog-content">
                    <p>
                        <b>Category:</b> {blog.category} <br />
                        <b>Author:</b> {blog.author}
                    </p>
                    <h2>{blog.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: blog.description }} />
                </div>
            </div>

            <hr className="my-5" />

            {/* Comment Section */}
            <div className="comments-section my-5">
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
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Posting..." : "Add Comment"}</button>
                </form>
                {error && <div style={{color: 'red'}}>{error}</div>}
                <div>
                    {comments.length === 0 && <p>No comments yet.</p>}
                    {comments.map(c => (
                        <div key={c.id} style={{borderBottom: '1px solid #eee', marginBottom: 10, paddingBottom: 5}}>
                            <b>{c.name}</b> <br /> <span style={{color: '#888', fontSize: 12}}>{new Date(c.createdAt).toLocaleString()}</span>
                            <div className="mt-3">{c.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BlogDetails;
