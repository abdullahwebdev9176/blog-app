'use client'

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios";

const page = () => {

  const [blogs, setBlog] = useState([])

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blog');
      setBlog(response.data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    }
  };

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className="posts-overview-container">
      <h2 className="mb-4">Posts Overview</h2>
      
      {blogs.Blogs && blogs.Blogs.length > 0 ? (
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
                <td>{blog.comments || 0}</td>
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
        <h6 className="text-center">No posts found</h6>
      )}

      <style jsx>{`
        .posts-overview-container {
          padding: 20px;
        }
        
        .listing-table {
          width: 100%;
          margin-top: 20px;
        }
        
        .badge {
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .badge-success {
          background-color: #28a745;
          color: white;
        }
        
        .badge-warning {
          background-color: #ffc107;
          color: #212529;
        }
        
        th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        
        td {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}

export default page
