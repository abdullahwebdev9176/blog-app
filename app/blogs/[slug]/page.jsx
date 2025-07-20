import BlogDetails from "@/components/BlogDetails";
import { connectDB } from "@/lib/config/db";
import { BlogModel } from "@/lib/models/BlogModel";
import { generateMetadata as generateSEOMetadata, generateStructuredData, getCanonicalUrl, generateExcerpt } from "@/lib/utils/seo";
import { notFound } from 'next/navigation';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const blog = await BlogModel.findOne({ slug: params.slug }).lean();
    
    if (!blog) {
      return generateSEOMetadata({
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
        noindex: true,
      });
    }

    const excerpt = generateExcerpt(blog.description, 160);
    const imageUrl = blog.image?.startsWith('http') 
      ? blog.image 
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}${blog.image}`;

    return generateSEOMetadata({
      title: blog.title,
      description: blog.excerpt || excerpt,
      url: getCanonicalUrl(`/blogs/${blog.slug}`),
      image: imageUrl,
      type: "article",
      publishedTime: blog.date?.toISOString(),
      modifiedTime: blog.updatedAt?.toISOString() || blog.date?.toISOString(),
      author: blog.author,
      tags: blog.category ? [blog.category] : [],
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateSEOMetadata({
      title: "Blog Post",
      description: "Read our latest blog post with valuable insights and expert opinions.",
    });
  }
}

const BlogPostPage = async ({ params }) => {
  try {
    await connectDB();
    const blog = await BlogModel.findOne({ slug: params.slug }).lean();
    
    if (!blog) {
      notFound();
    }

    // Convert MongoDB ObjectId to string for client component
    const blogData = {
      ...blog,
      _id: blog._id.toString(),
      date: blog.date?.toISOString(),
      updatedAt: blog.updatedAt?.toISOString(),
    };

    const excerpt = generateExcerpt(blog.description, 160);
    const imageUrl = blog.image?.startsWith('http') 
      ? blog.image 
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}${blog.image}`;

    const articleStructuredData = generateStructuredData({
      type: "BlogPosting",
      name: blog.title,
      description: blog.excerpt || excerpt,
      url: getCanonicalUrl(`/blogs/${blog.slug}`),
      image: imageUrl,
      publishedTime: blog.date?.toISOString(),
      modifiedTime: blog.updatedAt?.toISOString() || blog.date?.toISOString(),
      author: blog.author,
      category: blog.category,
      tags: blog.category ? [blog.category] : [],
      excerpt: blog.excerpt || excerpt,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
        <article>
          <BlogDetails blog={blogData} />
        </article>
      </>
    );
  } catch (error) {
    console.error('Error fetching blog:', error);
    notFound();
  }
};

export default BlogPostPage;
