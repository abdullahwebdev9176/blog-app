'use client'

import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const page = () => {

  const [blogs, setBlog] = useState([])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blog')
      if (!response.ok) {
        toast.error('Failed to fetch blogs')
        return
      }else{
        const data = await response.json()
        setBlog(data)
      }
      
    } catch (error) {
      toast.error('Error fetching blogs:', error)
    }
  }

    useEffect(() => {
      fetchBlogs()
    }, [])
  
  return (
    <div className="blog-list-container">
      {blogs.Blogs && blogs.Blogs.length > 0 ? (
        <table className="table table-striped table-bordered">
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
                  {/* Delete button logic here */}
                  <button className="btn btn-danger btn-sm">Delete</button>
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