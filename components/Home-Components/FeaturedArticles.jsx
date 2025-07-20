"use client";

import { assets } from "@/Assets/assets";
import Image from "next/image";
import { useEffect, useState } from "react";

const FeaturedArticles = () => {
  const [Blogs, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/blog');
    const data = await response.json();

    if (!response.ok) {
      toast.error('Failed to fetch blogs');
      setLoading(false);
      return;
    }

    // Filter blogs with isFeatured: true
    const featuredBlogs = data.Blogs.filter(blog => blog.isFeatured === true);
    setBlogData(featuredBlogs);
    console.log("Featured Articles Response", featuredBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <section className="featured-articles py-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-success">Featured Articles</h2>
        <div className="row">
          {Blogs.map((article) => (
            <div key={article._id || article.slug} className="col-md-6 col-lg-3 mb-4">
              <div className="card article-card shadow-sm h-100">
                <div className="image-wrapper">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={500}
                    height={300}
                    style={{ objectFit: "cover", height: "200px", width: "100%" }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text blog-excerpt flex-grow-1">{article.excerpt}</p>
                  <a href={`/blogs/${article.slug}`} className="btn btn-outline-success mt-auto">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
