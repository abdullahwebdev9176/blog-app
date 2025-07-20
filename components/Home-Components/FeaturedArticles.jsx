"use client";

import { assets } from "@/Assets/assets";
import Image from "next/image";
import "./FeaturedArticles.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSpinner, faFileAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';

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

    // Filter blogs with isFeatured: true and limit to 3
    const featuredBlogs = data.Blogs.filter(blog => blog.isFeatured === true).slice(0, 3);
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

  if (loading) {
    return (
      <section className="featured-articles py-5">
        <div className="container">
          <div className="featured-section-header text-center">
            <div className="featured-badge">
              <FontAwesomeIcon icon={faStar} className="me-2" />
              Featured Content
            </div>
            <h2 className="featured-title">Featured Articles</h2>
            <p className="featured-subtitle">
              Discover our hand-picked selection of exceptional articles and insights
            </p>
          </div>
          <div className="featured-loading">
            <FontAwesomeIcon icon={faSpinner} className="featured-spinner" spin />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-articles py-5">
      <div className="container">
        <div className="featured-section-header text-center">
          <div className="featured-badge">
            <FontAwesomeIcon icon={faStar} className="me-2" />
            Featured Content
          </div>
          <h2 className="featured-title">Featured Articles</h2>
          <p className="featured-subtitle">
            Discover our hand-picked selection of exceptional articles and insights
          </p>
        </div>
        
        {Blogs.length > 0 ? (
          <div className="row">
            {Blogs.map((article, index) => (
              <div key={article._id || article.slug} className="col-md-6 col-lg-4 mb-4">
                <div className="card article-card shadow-sm h-100">
                  <div className="image-wrapper">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={500}
                      height={300}
                      style={{ objectFit: "cover", height: "300px", width: "100%" }}
                    />
                    <div className="featured-indicator">
                      <FontAwesomeIcon icon={faStar} />
                      Featured
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text blog-excerpt flex-grow-1">
                      {article.excerpt || article.description?.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                    </p>
                    <a href={`/blogs/${article.slug}`} className="btn btn-outline-primary mt-auto">
                      Read More
                      <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="featured-empty">
            <div className="empty-icon">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
            <h4 className="empty-title">No Featured Articles</h4>
            <p className="empty-description">
              Featured articles will appear here once they are published and marked as featured.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedArticles;
