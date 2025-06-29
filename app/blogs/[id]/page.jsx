'use client';

import BlogDetails from "@/components/BlogDetails";
import { useEffect, useState, use } from "react";

const Page = ({ params }) => {
  // Unwrap params if it's a Promise (Next.js 15+)
  const actualParams = typeof params.then === 'function' ? use(params) : params;
  const id = actualParams.id;
  const [data, setData] = useState(null);

  const fetchBlogData = async (id) => {
    try {
      const response = await fetch(`/api/blog?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog data');
      }
      const result = await response.json();
      console.log(result.blog)
      setData(result.blog);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogData(id);
    }
  }, [id]);

  return <BlogDetails blog={data} />;
};

export default Page;
