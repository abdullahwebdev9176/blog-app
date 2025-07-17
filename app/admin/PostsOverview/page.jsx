'use client'

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios";
import './post-overview.css'

const page = () => {

  const [blogs, setBlog] = useState([])
  const [commentsCount, setCommentsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog');
      setBlog(response.data);
      console.log("Blogs:", response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const fetchCommentsCount = async () => {
        try {
            setCommentsLoading(true);
            // Fetch all comments from admin API to get complete count
            const res = await axios.get("/api/comments/admin");
            const allComments = res.data.comments || [];
            console.log("All Comments for count:", allComments.length);
            
            // Group comments by blogId and count them
            const commentsCountByBlog = allComments.reduce((acc, comment) => {
                acc[comment.blogId] = (acc[comment.blogId] || 0) + 1;
                return acc;
            }, {});
            
            console.log("Comments count by blog:", commentsCountByBlog);
            setCommentsCount(commentsCountByBlog);
        } catch (error) {
            console.error("Error fetching comments count:", error);
            setCommentsCount({});
            toast.error('Failed to fetch comments count');
        } finally {
            setCommentsLoading(false);
        }
    };

    // Only fetch comments count if we have blogs
    if (blogs.Blogs && blogs.Blogs.length > 0) {
        fetchCommentsCount();
    }
}, [blogs]);

  return (
    <div className="posts-overview-container">
      <h2 className="mb-4">Posts Overview</h2>
      
      {/* Summary Cards */}
      {!loading && blogs.Blogs && blogs.Blogs.length > 0 && (
        <div className="summary-cards mb-4">
          <div className="summary-card">
            <h3>{blogs.Blogs.length}</h3>
            <p>Total Posts</p>
          </div>
          <div className="summary-card">
            <h3>{blogs.Blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}</h3>
            <p>Total Views</p>
          </div>
          <div className="summary-card">
            <h3>{blogs.Blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)}</h3>
            <p>Total Likes</p>
          </div>
          <div className="summary-card">
            <h3>{Object.values(commentsCount).reduce((sum, count) => sum + count, 0)}</h3>
            <p>Total Comments</p>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Loading posts...</p>
        </div>
      ) : blogs.Blogs && blogs.Blogs.length > 0 ? (
        <table className="listing-table table table-striped table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {blogs.Blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.views || 0}</td>
                <td>{blog.likes || 0}</td>
                <td>
                  {commentsCount[blog._id] || 0}
                </td>
                <td>
                  <span className={`badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                    {blog.status || 'published'}
                  </span>
                </td>
                <td>{blog.date ? new Date(blog.date).toLocaleDateString() : ''}</td>
                <td>{blog.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center">
          <h6>No posts found</h6>
          <p className="text-muted">Create your first blog post to get started!</p>
        </div>
      )}

      
    </div>
  );
}

export default page
