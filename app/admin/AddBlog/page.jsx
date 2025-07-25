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
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState("draft");
  const [scheduledFor, setScheduledFor] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const fileInputRef = useRef(null);

  const config = {
    readonly: false,
    height: 500,
    placeholder: "Write your blog content here...",
    
    // Upload configuration
    uploader: {
      url: '/api/jodit-upload',
      format: 'json',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      prepareData: function (formdata) {
        return formdata;
      },
      isSuccess: function (resp) {
        return resp.success === 1;
      },
      getMessage: function (resp) {
        return resp.error || '';
      },
      process: function (resp) {
        return {
          files: resp.files || [],
          path: '',
          baseurl: '',
          error: resp.error,
          msg: resp.error || ''
        };
      }
    },

    // Enable drag and drop
    enableDragAndDropFileToEditor: true,
    
    // Paste options
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
    processPasteHTML: true,
    
    // Show counters
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,

    // Image settings
    image: {
      openOnDblClick: true,
      editSrc: true,
      editAlt: true,
      editLink: true,
      editSize: true,
      resizer: true
    },

    // Table settings
    table: {
      selectionCellStyle: 'border: 1px double #1e88e5;'
    },

    // Enhanced toolbar with headings and blog essentials
    buttons: [
      // Text formatting
      'bold', 'italic', 'underline', 'strikethrough', '|',
      
      // Headings - essential for blog structure
      {
        name: 'paragraph',
        list: {
          p: 'Normal',
          h1: 'Heading 1',
          h2: 'Heading 2',
          h3: 'Heading 3',
          h4: 'Heading 4',
          h5: 'Heading 5',
          h6: 'Heading 6'
        }
      },
      '|',
      
      // Font options
      'fontsize', 'brush', '|',
      
      // Lists - important for blog content
      'ul', 'ol', '|',
      
      // Alignment
      'left', 'center', 'right', 'justify', '|',
      
      // Quote - essential for blogs
      'quote', '|',
      
      // Media insertion
      'link', 'unlink', 'image', '|',
      
      // Code - useful for tech blogs
      'source', '|',
      
      // Table - useful for data presentation
      'table', '|',
      
      // Special elements
      'hr', 'symbols', '|',
      
      // History
      'undo', 'redo', '|',
      
      // View modes - preview is essential
      'preview', 'fullsize', '|',
      
      // Additional utilities
      'print', 'about'
    ],

    // Custom button configurations
    controls: {
      // Enhanced paragraph/heading control
      paragraph: {
        list: {
          p: 'Normal Text',
          h1: 'Heading 1 (Main Title)',
          h2: 'Heading 2 (Section)',
          h3: 'Heading 3 (Subsection)',
          h4: 'Heading 4 (Minor Heading)',
          h5: 'Heading 5 (Small Heading)',
          h6: 'Heading 6 (Smallest Heading)'
        }
      },
      
      // Font size options
      fontsize: {
        list: {
          '8': '8px',
          '9': '9px',
          '10': '10px',
          '11': '11px',
          '12': '12px',
          '14': '14px (Default)',
          '16': '16px',
          '18': '18px',
          '24': '24px',
          '30': '30px',
          '36': '36px',
          '48': '48px',
          '60': '60px',
          '72': '72px'
        }
      }
    },

    // Preview settings
    preview: true,
    
    // Events for better user experience
    events: {
      afterInit: function (editor) {
        console.log('Blog editor initialized successfully');
      },
      beforeSetValue: function (editor, data) {
        return data;
      }
    },

    // Additional blog-friendly options
    removeButtons: [], // Keep all buttons
    disablePlugins: ['speech-recognize'], // Disable speech if not needed
    
    // Autosave settings (optional)
    saveHeightInStorage: true,
    
    // Spellcheck
    spellcheck: true,
    
    // Tab behavior
    enter: 'P', // Create paragraphs on enter
    
    // Link settings
    link: {
      openInNewTabCheckbox: true,
      noFollowCheckbox: true
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate scheduled date if status is scheduled
      if (status === "scheduled" && !scheduledFor) {
        toast.error("Please select a scheduled date and time");
        setLoading(false);
        return;
      }

      if (status === "scheduled" && new Date(scheduledFor) <= new Date()) {
        toast.error("Scheduled date must be in the future");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("excerpt", excerpt);
      formData.append("author", author);
      formData.append("status", status);
      formData.append("isFeatured", status === "published" ? isFeatured : false);
      if (status === "scheduled" && scheduledFor) {
        formData.append("scheduledFor", scheduledFor);
      }
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
        const statusMessage = status === "published" ? "published" : 
                            status === "scheduled" ? "scheduled for publishing" : 
                            status === "draft" ? "saved as draft" : "saved as private";
        toast.success(`Blog post ${statusMessage} successfully!`);
        setTitle("");
        setCategory("");
        setDescription("");
        setExcerpt("");
        setAuthor("");
        setImage(null);
        setImagePreview(null);
        setStatus("draft");
        setScheduledFor("");
        setIsFeatured(false);
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

            {/* Excerpt Field */}
            <div className="admin-form-group">
              <label className="admin-label">
                Excerpt 
                <span className="admin-label-helper">
                  (Optional - Brief summary for blog listings, max 200 characters)
                </span>
              </label>
              <textarea
                className="admin-textarea"
                placeholder="Write a brief excerpt that summarizes your blog post..."
                value={excerpt}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setExcerpt(e.target.value);
                  }
                }}
                rows={3}
                maxLength={200}
              />
              <div className="admin-char-counter">
                {excerpt.length}/200 characters
              </div>
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

            {/* Status and Scheduling Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Post Status *</label>
                <select
                  className="admin-select"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    if (e.target.value !== "scheduled") {
                      setScheduledFor("");
                    }
                    // Disable featured if status is not published
                    if (e.target.value !== "published") {
                      setIsFeatured(false);
                    }
                  }}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {status === "scheduled" && (
                <div className="admin-form-group">
                  <label className="admin-label">Scheduled Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="admin-input"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    required={status === "scheduled"}
                  />
                </div>
              )}
            </div>

            {/* Featured Article Checkbox */}
            <div className="admin-form-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  disabled={status !== "published"}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--admin-primary)'
                  }}
                />
                <label htmlFor="isFeatured" className="admin-label" style={{ margin: 0, fontSize: '14px' }}>
                  Mark as Featured Article
                  {status !== "published" && (
                    <span style={{ color: 'var(--admin-text-secondary)', fontSize: '12px', display: 'block' }}>
                      (Only published articles can be featured)
                    </span>
                  )}
                </label>
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
                setExcerpt("");
                setAuthor("");
                setImage(null);
                setImagePreview(null);
                setStatus("draft");
                setScheduledFor("");
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
                  {status === "published" ? "Publishing..." : 
                   status === "scheduled" ? "Scheduling..." : 
                   status === "draft" ? "Saving Draft..." : "Saving as Private..."}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUpload} />
                  {status === "published" ? "Publish Post" : 
                   status === "scheduled" ? "Schedule Post" : 
                   status === "draft" ? "Save as Draft" : "Save as Private"}
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
