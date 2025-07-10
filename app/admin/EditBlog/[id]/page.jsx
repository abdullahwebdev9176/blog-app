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

  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog content here...",
    uploader: {
      insertImageAsBase64URI: true
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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("author", author);
      if (newImage) {
        formData.append("image", newImage);
      }

      await axios.put(`/api/blog?id=${blogId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog updated successfully!");
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
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
