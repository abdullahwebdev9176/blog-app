"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/Assets/assets";
import "./BlogShowcase.css";

const BlogShowcase = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();

      if (response.ok) {
        // Get latest 3 published blogs
        const publishedBlogs = data.Blogs
          .filter(blog => blog.status === 'published')
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 3); 
        
        setBlogs(publishedBlogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = ["All", "Technology", "Lifestyle", "Startup", "Health"];

  const filteredBlogs = activeCategory === "All" 
    ? blogs.slice(0, 3)
    : blogs.filter(blog => blog.category === activeCategory).slice(0, 3);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, '');
    return cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength) + '...' 
      : cleanText;
  };

  if (loading) {
    return (
      <section className="blog-showcase py-5">
        <div className="container">
          <div className="text-center mb-5">
            <div className="placeholder-glow">
              <span className="placeholder col-4 mb-3" style={{ height: '2.5rem' }}></span>
            </div>
            <div className="placeholder-glow">
              <span className="placeholder col-6" style={{ height: '1.2rem' }}></span>
            </div>
          </div>
          
          <div className="row g-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-lg-4 col-md-6">
                <div className="blog-card h-100">
                  <div className="placeholder-glow">
                    <div className="placeholder" style={{ height: "250px", borderRadius: "15px" }}></div>
                  </div>
                  <div className="blog-card-content">
                    <div className="placeholder-glow mb-3">
                      <span className="placeholder col-3"></span>
                    </div>
                    <div className="placeholder-glow mb-2">
                      <span className="placeholder col-8"></span>
                    </div>
                    <div className="placeholder-glow mb-3">
                      <span className="placeholder col-12"></span>
                      <span className="placeholder col-6"></span>
                    </div>
                    <div className="placeholder-glow">
                      <span className="placeholder col-4"></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-showcase py-5">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="section-badge mb-3">
            <span className="badge-text">📝 Latest Stories</span>
          </div>
          <h2 className="section-title mb-3">
            Discover Our <span className="text-primary">Latest Insights</span>
          </h2>
          <p className="section-subtitle">
            Explore our collection of thought-provoking articles, expert insights, and trending topics 
            that matter to you. Stay informed and inspired with our latest content.
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter mb-5">
          <div className="filter-container">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="row g-4 mb-5">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <div key={blog._id} className="col-lg-4 col-md-6">
                <article className="blog-card h-100">
                  <div className="blog-image-container">
                    <Image
                      src={blog.image || assets.blog_pic_1}
                      alt={blog.title}
                      width={400}
                      height={350}
                      className="blog-image"
                    />
                    <div className="blog-overlay">
                      <div className="blog-category-badge">
                        {blog.category}
                      </div>
                      {index < 3 && (
                        <div className="trending-indicator">
                          {index === 0 ? '🔥' : '📈'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="blog-card-content">
                    <div className="blog-meta mb-2">
                      <span className="blog-date">
                        📅 {formatDate(blog.createdAt || blog.date)}
                      </span>
                      <span className="blog-views">
                        👁️ {blog.views || 0}
                      </span>
                    </div>
                    
                    <h3 className="blog-title">
                      <Link href={`/blogs/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h3>
                    
                    <p className="blog-excerpt">
                      {blog.excerpt || truncateText(blog.description)}
                    </p>
                    
                    <div className="blog-footer">
                      <div className="author-info">
                        <div className="author-avatar">
                          {blog.author?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className="author-name">By {blog.author}</span>
                      </div>
                      
                      <Link href={`/blogs/${blog.slug}`} className="read-more-btn">
                        Read More
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="empty-state text-center py-5">
                <div className="empty-icon mb-3">
                  📝
                </div>
                <h4 className="empty-title">No blogs found</h4>
                <p className="empty-description">
                  {activeCategory === "All" 
                    ? "No published blogs available at the moment." 
                    : `No blogs found in "${activeCategory}" category.`
                  }
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setActiveCategory("All")}
                >
                  View All Blogs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="cta-section text-center">
          <div className="cta-content">
            <h3 className="cta-title">Want to Read More?</h3>
            <p className="cta-description">
              Explore our complete collection of articles and stay updated with the latest trends and insights.
            </p>
            <Link href="/blog-posts" className="cta-btn">
              View All Articles
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogShowcase;
