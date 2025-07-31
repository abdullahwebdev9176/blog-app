"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { Upload, Loader2, Image, Plus, Search, FileText, Tags } from 'lucide-react';

// Dynamically import Jodit editor
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="form-control" style={{ minHeight: '400px' }}>Loading editor...</div>
});

const EditBlogPage = ({ params }) => {
  const router = useRouter();
  const blogId = params.id;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("draft");
  const [scheduledFor, setScheduledFor] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeywords, setFocusKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState("");

  // Helper functions for focus keywords
  const addKeyword = () => {
    const keyword = currentKeyword.trim();
    if (keyword && !focusKeywords.includes(keyword) && focusKeywords.length < 5) {
      setFocusKeywords([...focusKeywords, keyword]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFocusKeywords(focusKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleKeywordInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

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
        console.log('Edit blog editor initialized successfully');
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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog?id=${blogId}`);
        const blog = response.data.blog;

        setTitle(blog.title || "");
        setDescription(blog.description || "");
        setAuthor(blog.author || "");
        setImage(blog.image || "");
        setStatus(blog.status || "draft");
        setIsFeatured(blog.isFeatured || false);
        setMetaDescription(blog.metaDescription || "");
        
        // Handle focus keywords - convert from string to array
        if (blog.focusKeywords) {
          const keywordsArray = blog.focusKeywords.split(", ").filter(k => k.trim());
          setFocusKeywords(keywordsArray);
        } else {
          setFocusKeywords([]);
        }
        setMetaDescription(blog.metaDescription || "");
        
        // Parse focus keywords
        if (blog.focusKeywords && typeof blog.focusKeywords === 'string') {
          const keywords = blog.focusKeywords.split(',').map(k => k.trim()).filter(k => k);
          setFocusKeywords(keywords);
        } else {
          setFocusKeywords([]);
        }
        
        // Format scheduledFor for datetime-local input
        if (blog.scheduledFor) {
          const date = new Date(blog.scheduledFor);
          const formattedDate = date.toISOString().slice(0, 16);
          setScheduledFor(formattedDate);
        } else {
          setScheduledFor("");
        }

        if (blog.category && blog.category._id) {
          setCategory(blog.category._id);
        } else if (blog.category) {
          setCategory(blog.category);
        } else {
          setCategory("");
        }
      } catch (err) {
        toast.error("Failed to fetch blog data");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data.allCategories);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    if (blogId) {
      fetchBlog();
      fetchCategories();
    }
  }, [blogId]);

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
      formData.append("author", author);
      formData.append("status", status);
      formData.append("isFeatured", status === "published" ? isFeatured : false);
      formData.append("metaDescription", metaDescription);
      formData.append("focusKeywords", focusKeywords.join(", "));
      if (status === "scheduled" && scheduledFor) {
        formData.append("scheduledFor", scheduledFor);
      }
      if (newImage) {
        formData.append("image", newImage);
      }

      await axios.put(`/api/blog?id=${blogId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const statusMessage = status === "published" ? "published" : 
                          status === "scheduled" ? "scheduled for publishing" : 
                          status === "draft" ? "saved as draft" : "saved as private";
      toast.success(`Blog ${statusMessage} successfully!`);
      router.push("/admin/BlogList");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>Edit Blog</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">{category}</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Description</label>
          <JoditEditor
            value={description}
            config={config}
            onBlur={(newContent) => setDescription(newContent)}
          />
        </div>
        <div className="mb-3">
          <label>Author</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Post Status</label>
          <select
            className="form-control"
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
          <div className="mb-3">
            <label>Scheduled Date & Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required={status === "scheduled"}
            />
          </div>
        )}
        <div className="mb-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="editIsFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              disabled={status !== "published"}
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#007bff'
              }}
            />
            <label htmlFor="editIsFeatured" style={{ margin: 0, fontSize: '14px' }}>
              Mark as Featured Article
              {status !== "published" && (
                <span style={{ color: '#6c757d', fontSize: '12px', display: 'block' }}>
                  (Only published articles can be featured)
                </span>
              )}
            </label>
          </div>
        </div>

        {/* SEO Settings Section */}
        <div className="admin-form-section" style={{ 
          background: 'var(--admin-bg-secondary)', 
          padding: '1.5rem', 
          borderRadius: 'var(--admin-radius-md)', 
          border: '1px solid var(--admin-border-color)',
          marginBottom: '1.5rem'
        }}>
          <h3 className="admin-section-title" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            color: 'var(--admin-primary)',
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid var(--admin-border-color)'
          }}>
            <Search 
              size={20}
              style={{ 
                color: 'var(--admin-primary)'
              }} 
            />
            SEO Settings
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--admin-text-secondary)',
              fontWeight: '400',
              marginLeft: '0.5rem'
            }}>
              Optimize your content for search engines
            </span>
          </h3>
          
          {/* Meta Description */}
          <div className="mb-3">
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              <FileText 
                size={16}
                style={{ color: 'var(--admin-info)' }} 
              />
              Meta Description
              <span style={{ 
                color: 'var(--admin-text-secondary)', 
                fontSize: '0.75rem',
                fontWeight: '400'
              }}>
                (Search engine preview text)
              </span>
            </label>
            <textarea
              className="form-control"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Write a compelling description that summarizes your blog post for search engines and social media previews..."
              maxLength={250}
              rows={4}
              style={{ resize: 'vertical' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '0.5rem',
              fontSize: '12px',
              color: 'var(--admin-text-secondary)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Keep it between 120-160 characters for optimal display in search results
              </span>
              <span style={{ 
                fontWeight: '500',
                color: metaDescription.length > 160 ? 'var(--admin-danger)' : 
                       metaDescription.length > 120 ? 'var(--admin-success)' : 
                       'var(--admin-text-secondary)'
              }}>
                {metaDescription.length}/250
              </span>
            </div>
          </div>

          {/* Focus Keywords */}
          <div className="mb-3">
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              <Tags 
                size={16}
                style={{ color: 'var(--admin-warning)' }} 
              />
              Focus Keywords
              <span style={{ 
                color: 'var(--admin-text-secondary)', 
                fontSize: '0.75rem',
                fontWeight: '400'
              }}>
                (2-5 keywords for SEO)
              </span>
            </label>
            
            {/* Keywords Input */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-control"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={handleKeywordInputKeyPress}
                  placeholder="Type a keyword and press Enter"
                  disabled={focusKeywords.length >= 5}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  disabled={!currentKeyword.trim() || focusKeywords.includes(currentKeyword.trim()) || focusKeywords.length >= 5}
                  className="btn btn-outline-primary"
                  style={{ 
                    padding: '0.5rem 1rem',
                    minWidth: 'auto',
                    fontSize: '0.875rem'
                  }}
                >
                  <Plus size={14} style={{ marginRight: '0.25rem' }} />
                  Add
                </button>
              </div>
            </div>

            {/* Keywords Display */}
            {focusKeywords.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem',
                  padding: '1rem',
                  backgroundColor: 'var(--admin-bg-secondary)',
                  borderRadius: 'var(--admin-radius-md)',
                  border: '1px solid var(--admin-border-color)'
                }}>
                  {focusKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.375rem 0.75rem',
                        backgroundColor: 'var(--admin-primary)',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => removeKeyword(keyword)}
                      title="Click to remove"
                    >
                      {keyword}
                      <span style={{ 
                        marginLeft: '0.25rem',
                        fontSize: '1rem',
                        opacity: 0.8
                      }}>
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Helper Text */}
            <div style={{ 
              fontSize: '12px',
              color: 'var(--admin-text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                💡 Enter keywords that best describe your content (press Enter or click Add)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                🎯 Current keywords: {focusKeywords.length}/5 
                {focusKeywords.length >= 5 && " (Maximum reached)"}
              </span>
              {focusKeywords.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  🗑️ Click on any keyword tag to remove it
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label>Current Image</label><br />
          {newImage ? (
            <img
              src={URL.createObjectURL(newImage)}
              alt="New Preview"
              style={{ maxWidth: 200, marginBottom: 10 }}
            />
          ) : (
            image && typeof image === "string" && (
              <img src={image} alt="Current Blog" style={{ maxWidth: 200, marginBottom: 10 }} />
            )
          )}
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            status === "published" ? "Publishing..." : 
            status === "scheduled" ? "Scheduling..." : 
            status === "draft" ? "Saving Draft..." : "Saving as Private..."
          ) : (
            status === "published" ? "Publish Blog" : 
            status === "scheduled" ? "Schedule Blog" : 
            status === "draft" ? "Save as Draft" : "Save as Private"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
