import BlogList from '@/components/BlogList'
import React from 'react'
import { generateMetadata as generateSEOMetadata, getCanonicalUrl } from "@/lib/utils/seo";

export const metadata = generateSEOMetadata({
  title: "Blog Posts - Latest Articles and Insights",
  description: "Explore our latest blog posts covering technology, lifestyle, startups, and more. Stay updated with valuable insights and expert opinions from our community.",
  url: getCanonicalUrl('/blog-posts'),
  type: "website",
});

const BlogPostsPage = () => {
    return (
        <main className="container-fluid">
            <div className="row">
                <div className="col-xl-10 mx-auto">
                    <header className="text-center py-4">
                        <h1 className="visually-hidden">Latest Blog Posts</h1>
                    </header>
                    <section>
                        <BlogList />
                    </section>
                </div>
            </div>
        </main>
    )
}

export default BlogPostsPage