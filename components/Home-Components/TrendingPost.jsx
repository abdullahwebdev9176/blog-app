"use client";

import { assets } from "@/Assets/assets";
import Image from "next/image";
import "./TrendingStyle.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSpinner, faFileAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const TrendingPost = () => {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrendingBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog');
      
      if (!response.ok) {
        console.error('Failed to fetch blogs');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      // Sort blogs by views in descending order and take top 3
      const sortedByViews = data.Blogs
        .filter(blog => blog.status === 'published') // Only show published blogs
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 3); // Get top 3 trending posts
      
      setTrendingBlogs(sortedByViews);
      console.log("Trending Posts Response", sortedByViews);
    } catch (error) {
      console.error('Error fetching trending blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  if (loading) {
    return (
      <section className="trending-posts py-5">
        <div className="container">
          <div className="trending-section-header text-center">
            <div className="trending-badge">
              <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
              Loading Trending
            </div>
            <h2 className="trending-title">Trending Posts</h2>
            <p className="trending-subtitle">Discover what's hot right now</p>
          </div>
          <div className="row">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-12 col-sm-6 col-lg-4 mb-4">
                <div className="card trending-card h-100">
                  <div className="placeholder-glow">
                    <div className="placeholder" style={{ height: "200px", width: "100%" }}></div>
                  </div>
                  <div className="card-body">
                    <h5 className="placeholder-glow">
                      <span className="placeholder col-8"></span>
                    </h5>
                    <p className="placeholder-glow">
                      <span className="placeholder col-12"></span>
                      <span className="placeholder col-8"></span>
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </small>
                      <small className="placeholder-glow">
                        <span className="placeholder col-4"></span>
                      </small>
                    </div>
                    <div className="placeholder-glow">
                      <span className="placeholder col-6"></span>
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
    <section className="trending-posts py-5">
      <div className="container">
        <div className="trending-section-header text-center">
          <div className="trending-badge">
            <FontAwesomeIcon icon={faStar} className="me-2" />
            Hot Content
          </div>
          <h2 className="trending-title">Trending Posts</h2>
          <p className="trending-subtitle">Discover what's trending in our community</p>
        </div>
        <div className="row">
          {trendingBlogs.length > 0 ? (
            trendingBlogs.map((post, index) => (
              <div key={post._id} className="col-12 col-sm-6 col-lg-4 mb-4">
                <div className="card trending-card h-100">
                  {/* Trending Badge */}
                  <div className="position-relative">
                    <div className="trending-image-wrapper">
                      <Image
                        src={post.image || assets.blog_pic_1}
                        alt={post.title}
                        width={500}
                        height={300}
                        style={{ objectFit: "cover", width: "100%", height: "300px" }}
                      />
                      <div className="trending-overlay"></div>
                    </div>
                    {index === 0 && (
                      <span className="trending-rank rank-1">
                        <FontAwesomeIcon icon={faStar} className="me-1" />
                        #1 Trending
                      </span>
                    )}
                    {index < 3 && index > 0 && (
                      <span className="trending-rank rank-hot">
                        <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                        Trending
                      </span>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="trending-card-title">{post.title}</h5>
                    <p className="trending-card-text flex-grow-1">
                      {post.excerpt || post.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                    </p>
                    <div className="trending-meta d-flex justify-content-between align-items-center mb-3">
                      <small className="trending-author">By {post.author}</small>
                      <small className="trending-views">
                        <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                        {post.views || 0} views
                      </small>
                    </div>
                    <a href={`/blogs/${post.slug}`} className="btn trending-btn mt-auto">
                      Read More
                      <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <div className="trending-empty-state">
                <FontAwesomeIcon icon={faStar} className="trending-empty-icon mb-3" />
                <h4 className="trending-empty-title">No trending posts available</h4>
                <p className="trending-empty-text">Check back later for trending content!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingPost;
