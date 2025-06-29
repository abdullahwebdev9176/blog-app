// components/BlogDetails.jsx
"use client";
import Image from "next/image";

const BlogDetails = ({ blog }) => {
    if (!blog) return <p>Loading...</p>;

    return (
        <>
            <div className="details-container">
                <div className="blog-details-img">
                    {/* Use img tag for dynamic URLs */}
                    <img src={blog.image} alt={blog.title}/>
                </div>
                <div className="blog-content">
                    <p>
                        <b>Category:</b> {blog.category} <br />
                        <b>Author:</b> {blog.author}
                    </p>
                    <h2>{blog.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: blog.description }} />
                    
                </div>
            </div>
        </>
    );
};

export default BlogDetails;
