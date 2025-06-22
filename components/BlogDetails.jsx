// components/BlogDetails.jsx
"use client";
import { blog_data } from "@/Assets/assets";
import { useEffect, useState } from "react";
import Image from "next/image";

const BlogDetails = ({ id }) => {
    const [blogData, setBlogData] = useState(null);

    useEffect(() => {
        const data = blog_data.find((item) => Number(id) === item.id);
        if (data) setBlogData(data);
    }, [id]);

    if (!blogData) return <p>Loading...</p>;

    return (
        <>
            <div className="details-container">
                <div className="blog-details-img">
                    <Image src={blogData.image} alt={blogData.title} />
                </div>
                <div className="blog-content">
                    <h2>{blogData.title}</h2>
                    <p>{blogData.description}</p>
                </div>
            </div>
        </>
    );
};

export default BlogDetails;
