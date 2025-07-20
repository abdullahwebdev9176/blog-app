"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

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
