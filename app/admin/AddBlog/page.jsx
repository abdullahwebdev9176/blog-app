'use client';

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

// Dynamically import Jodit editor
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="form-control" style={{ minHeight: '400px' }}>Loading editor...</div>
});

const AddBlogPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog content here...",
    uploader: {
      insertImageAsBase64URI: true
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("author", author);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post("/api/blog", formData);

      if (response.data.succes) {
        toast.success("Blog submitted successfully!");
        setTitle("");
        setCategory("");
        setDescription("");
        setAuthor("");
        setImage(null);
      } else {
        toast.error("Failed to submit blog");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.allCategories);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1 className="admin-blog-header">Add New Blog</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="mb-1">Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="mb-1">Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="mb-1">Description</label>
          <JoditEditor
            value={description}
            config={config}
            onBlur={(newContent) => setDescription(newContent)}
          />
        </div>

        <div className="mb-3">
          <label className="mb-1">Author</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter blog author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="mb-1" htmlFor="thumbnail-image">Thumbnail Image</label>
          <input
            type="file"
            id="thumbnail-image"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
