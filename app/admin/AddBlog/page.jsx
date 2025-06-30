'use client'
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBlogPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("author", author);
      if (image) formData.append("image", image);

      const response = await axios.post("/api/blog", formData);
      if(response.data.succes){
        toast.success("Blog submitted successfully!");
        setTitle("");
        setCategory("");
        setDescription("");
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
          <input type="text" className="form-control" placeholder="Enter blog Category" value={category} onChange={e => setCategory(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="mb-1">Content</label>
          <textarea className="form-control" rows="5" placeholder="Write your blog content here" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
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