'use client';

import BlogDetails from "@/components/BlogDetails";
import { useEffect, useState, use } from "react";

const Page = ({ params }) => {
  // Unwrap params if it's a Promise (Next.js 15+)
  const actualParams = typeof params.then === 'function' ? use(params) : params;
  const id = actualParams.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogData = async (id) => {
    try {
      const response = await fetch(`/api/blog?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog data');
      }
      const result = await response.json();
      console.log(result.blog);
      setData(result.blog);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogData(id);
    }
  }, [id]);

  if (loading) {
    return <p>Loading blog details...</p>;
  }

  if (!data) {
    return <p>Blog not found.</p>;
  }

  return <BlogDetails blog={data} />;
};

export default Page;
