"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const EditBlogPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog?id=${blogId}`);
        const blog = response.data.blog;
        setTitle(blog.title || "");
        setCategory(blog.category || "");
        setDescription(blog.description || "");
        setAuthor(blog.author || "");
        setImage(blog.image || "");
      } catch (err) {
        toast.error("Failed to fetch blog data");
      }
    };
    if (blogId) fetchBlog();
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Blog updated successfully!");
      router.push("/admin/BlogList");
    } catch (err) {
      toast.error("Failed to update blog");
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
          <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" rows="5" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
        </div>
        <div className="mb-3">
          <label>Author</label>
          <input type="text" className="form-control" value={author} onChange={e => setAuthor(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Current Image</label><br />
          {/* Show preview of new image if selected, otherwise show old image */}
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
            onChange={e => setNewImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Updating..." : "Update Blog"}</button>
      </form>
    </div>
  );
};

export default EditBlogPage;
