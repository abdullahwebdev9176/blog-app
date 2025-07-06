'use client'
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

// Dynamically import Jodit with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="form-control" style={{minHeight: '400px'}}>Loading editor...</div>
});

const AddBlogPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  // const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const editor = useRef(null);
  
  // Jodit editor configuration
  const config = {
    readonly: false,
    height: 400,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    placeholder: "Write your blog content here..."
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      let descriptionValue = "";
      if (editor.current) {
        if (typeof editor.current.getEditorValue === "function") {
          descriptionValue = editor.current.getEditorValue();
        } else if (editor.current.value) {
          descriptionValue = editor.current.value;
        }
      }
      formData.append("description", descriptionValue);
      formData.append("author", author);
      if (image) formData.append("image", image);

      const response = await axios.post("/api/blog", formData);
      if(response.data.succes){
        toast.success("Blog submitted successfully!");
        setTitle("");
        setCategory("");
        if(editor.current && typeof editor.current.setEditorValue === "function") {
          editor.current.setEditorValue("");
        }
        setAuthor("");
        setImage("");
      }else{
        toast.error("Failed to submit blog");
      }
      
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/categories');
            console.log(res.data)
            setCategories(res.data.allCategories);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
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
          <input type="text" className="form-control" placeholder="Enter blog title" value={title} onChange={e => setTitle(e.target.value)} required />
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
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="mb-1">Description</label>
          <JoditEditor
            ref={editor}
            config={config}
          />
        </div>
        <div className="mb-3">
          <label className="mb-1">Author</label>
          <input type="text" className="form-control" placeholder="Enter blog Author" value={author} onChange={e => setAuthor(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="mb-1" htmlFor="thumbnail-image">Thumbnail Image</label>
          <input type="file" id="thumbnail-image" className="form-control" onChange={e => setImage(e.target.files[0])} accept="image/*" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Submitting..." : "Add Blog"}</button>
      </form>
    </div>
  );
};

export default AddBlogPage;