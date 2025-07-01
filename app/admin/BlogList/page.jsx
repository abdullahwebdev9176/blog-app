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
  

  // Delete blog handler
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`/api/blog?id=${blogId}`);
        toast.success('Blog deleted successfully');
        setBlog((prev) => ({
          ...prev,
          Blogs: prev.Blogs.filter((b) => b._id !== blogId),
        }));
      } catch (err) {
        toast.error('Failed to delete blog');
      }
    }
  };

  return (
    <div className="blog-list-container">
      {blogs.Blogs && blogs.Blogs.length > 0 ? (
        <table className="listing-table table table-striped table-bordered">
          <thead>
            <tr>
              <th>Author</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {blogs.Blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.author}</td>
                <td>{blog.title}</td>
                <td>{blog.category}</td>
                <td>{blog.date ? new Date(blog.date).toLocaleDateString() : ''}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  {/* Edit button logic here */}
                  <button className="btn btn-primary btn-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h6 className="text-center">Blogs Not Found</h6>
      )}
    </div>
  );
}

export default page