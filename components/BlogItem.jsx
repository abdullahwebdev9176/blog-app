"use client";

import { assets } from "@/Assets/assets"
import Link from "next/link"
import Image from "next/image"

// Helper function to remove HTML tags from description
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

const BlogItem = ({ title, image, excerpt, category, id }) => {
    return (
        <>
            <div className="col-md-4 mb-4">
                <div className="card blog-card h-100 shadow-sm">
                    <div className="blog-card-image">
                        <Link href={`/blogs/${id}`}>
                            <Image src={image} className="card-img-top" alt={title} width={400} height={300}/>
                        </Link>
                    </div>
                    <div className="card-body d-flex flex-column">
                        <span className="category-title">{category}</span>
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{excerpt}</p>
                        <Link href={`/blogs/${id}`} className="blog-btn">
                            Read More <Image src={assets.arrow} className="ms-2" alt="" width={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogItem