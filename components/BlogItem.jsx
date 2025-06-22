import { assets, blog_data } from "@/Assets/assets"
import Link from "next/link"
import Image from "next/image"

const BlogItem = ({ title, image, description, category }) => {
    return (
        <>
            <div className="col-md-4 mb-4">
                <div className="card blog-card h-100 shadow-sm">
                    <div className="blog-card-image">
                        <Image src={image} className="card-img-top" alt={title} />
                    </div>
                    <div className="card-body d-flex flex-column">
                        
                        <span className="category-title">{category}</span>
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}</p>
                        <Link href="#" className="blog-btn">
                            Read More <Image src={assets.arrow} className="ms-2" alt="" width={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogItem