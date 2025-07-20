"use client";

import { assets } from "@/Assets/assets"
import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faArrowRight, faEye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import "./BlogItem.css";

// Helper function to remove HTML tags from description
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

const BlogItem = ({ title, image, excerpt, category, id, slug, author, date, views }) => {
    const linkHref = slug ? `/blogs/${slug}` : `/blogs/${id}`;
    
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Recent';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <article className="blog-item-card">
                <div className="blog-card-wrapper">
                    {/* Image Section */}
                    <div className="blog-image-container">
                        <Link href={linkHref} className="image-link">
                            <Image 
                                src={image} 
                                className="blog-image" 
                                alt={title} 
                                width={400} 
                                height={250}
                                style={{ objectFit: "cover" }}
                            />
                            <div className="image-overlay">
                                <div className="read-more-overlay">
                                    <FontAwesomeIcon icon={faArrowRight} className="overlay-icon" />
                                    <span>Read Article</span>
                                </div>
                            </div>
                        </Link>
                        <div className="category-badge">
                            <FontAwesomeIcon icon={faTag} className="me-1" />
                            {category}
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="blog-card-content">
                        {/* Meta Information */}
                        <div className="blog-meta">
                            <span className="blog-date">
                                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                {formatDate(date)}
                            </span>
                            {views && (
                                <span className="blog-views">
                                    <FontAwesomeIcon icon={faEye} className="me-1" />
                                    {views} views
                                </span>
                            )}
                        </div>
                        
                        {/* Title */}
                        <h3 className="blog-title">
                            <Link href={linkHref} className="title-link">
                                {title}
                            </Link>
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="blog-excerpt">
                            {excerpt || stripHtml(title).substring(0, 120) + '...'}
                        </p>
                        
                        {/* Author & Read More */}
                        <div className="blog-footer">
                            {author && (
                                <div className="author-section">
                                    <div className="author-avatar">
                                        {author.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="author-name">By {author}</span>
                                </div>
                            )}
                            
                            <Link href={linkHref} className="read-more-btn">
                                Read More
                                <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default BlogItem