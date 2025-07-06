import React, { useState, useEffect } from 'react';
import BlogItem from './BlogItem';
import SkeletonLoader from './BLogPlaceholder';
import { toast } from "react-toastify";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [Blogs, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredBlogs = Blogs.filter((item) =>
    menu === "All" ? true : item.category === menu
  );

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog');
      if (!response.ok) {
        toast.error('Failed to fetch blogs');
        setLoading(false);
        return;
      } else {
        const data = await response.json();
        setBlogData(data.Blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <section className='blogs-container'>
      <div className='category-filter-box mb-5'>
        <ul>
          <li className={`category-tab ${menu === 'All' ? 'active' : ''}`} onClick={() => setMenu('All')}>All</li>
          <li className={`category-tab ${menu === 'Technology' ? 'active' : ''}`} onClick={() => setMenu('Technology')}>Technology</li>
          <li className={`category-tab ${menu === 'Startup' ? 'active' : ''}`} onClick={() => setMenu('Startup')}>Startup</li>
          <li className={`category-tab ${menu === 'Lifestyle' ? 'active' : ''}`} onClick={() => setMenu('Lifestyle')}>Lifestyle</li>
        </ul>
      </div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          {loading ? (
            <SkeletonLoader />
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((item) => (
              <BlogItem id={item._id} key={item._id} image={item.image} title={item.title} description={item.description} category={item.category} />
            ))
          ) : (
            <h6 className='text-center'>Blogs Not Found</h6>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogList;
