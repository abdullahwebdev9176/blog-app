'use client';

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner, faImage, faPlus } from '@fortawesome/free-solid-svg-icons';

// Dynamically import Jodit editor
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="admin-loading">Loading editor...</div>
});

const AddBlogPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog content here...",
    uploader: {
      insertImageAsBase64URI: true
    },
    buttons: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'link', 'image', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'fullsize'
    ]
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

      const response = await axios.post("/api/blog", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log("Response from server:", response.data);

      if (response.data.success) {
        toast.success("Blog post created successfully!");
        setTitle("");
        setCategory("");
        setDescription("");
        setAuthor("");
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.error("Server response indicates failure:", response.data);
        toast.error(response.data.message || "Failed to create blog post");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
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
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-card-header">
          <h1 className="admin-card-title">
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
            Create New Blog Post
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0', 
            color: 'var(--admin-text-secondary)',
            fontSize: '0.875rem'
          }}>
            Fill in the details below to create a new blog post
          </p>
        </div>
        
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Title Field */}
            <div className="admin-form-group">
              <label className="admin-label">Blog Title *</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Enter a compelling blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Author and Category Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Author *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Category *</label>
                <select
                  className="admin-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Editor */}
            <div className="admin-form-group">
              <label className="admin-label">Content *</label>
              <div className="admin-editor-container">
                <JoditEditor
                  value={description}
                  config={config}
                  onBlur={(newContent) => setDescription(newContent)}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="admin-form-group">
              <label className="admin-label">Featured Image</label>
              <div className="admin-file-upload" onClick={() => fileInputRef.current?.click()}>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                {imagePreview ? (
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '500px', 
                        maxHeight: '500px', 
                        objectFit: 'cover',
                        borderRadius: 'var(--admin-radius-md)',
                        marginBottom: '1rem'
                      }}
                    />
                    <p className="admin-file-upload-text">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faImage} className="admin-file-upload-icon" />
                    <p className="admin-file-upload-text">Click to upload featured image</p>
                    <p className="admin-file-upload-subtext">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>

          </form>
        </div>

        <div className="admin-card-footer">
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button 
              type="button" 
              className="admin-btn admin-btn-outline"
              onClick={() => {
                setTitle("");
                setCategory("");
                setDescription("");
                setAuthor("");
                setImage(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Clear Form
            </button>
            <button 
              type="submit" 
              className="admin-btn admin-btn-primary"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Publishing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUpload} />
                  Publish Blog Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlogPage;
