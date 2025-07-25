'use client';

import React, { useState, useEffect } from 'react';
import BlogItem from './BlogItem';
import SkeletonLoader from './Placeholders/BlogPlaceholder';
import { toast } from "react-toastify";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [Blogs, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  console.log(Blogs)

  const [searchQuery, setSearchQuery] = useState("");

  const finalFilteredBlogs = Blogs.filter((item) => {
    if (searchQuery.trim() !== "") {
     
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      
      return menu === "All" ? true : item.category.toLowerCase() === menu.toLowerCase();
    }
  });


  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog');
    
      console.log("Abdullah", response);

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

      <input
        type="text"
        placeholder="Search blogs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control mb-4 searchBox"
      />

      <div className='category-filter-box mb-5'>
        <ul>
          <li className={`category-tab ${menu === 'All' ? 'active' : ''}`} onClick={() => setMenu('All')}>All</li>
          <li className={`category-tab ${menu === 'Healthy Lifestyle' ? 'active' : ''}`} onClick={() => setMenu('Healthy Lifestyle')}>Healthy Lifestyle</li>
          <li className={`category-tab ${menu === 'Nutrition & Diet' ? 'active' : ''}`} onClick={() => setMenu('Nutrition & Diet')}>Nutrition & Diet</li>
          <li className={`category-tab ${menu === 'Health & Wellness' ? 'active' : ''}`} onClick={() => setMenu('Health & Wellness')}>Health & Wellness</li>
        </ul>
      </div>
        <div className="row justify-content-center">
          {loading ? (
            <SkeletonLoader />
          ) : finalFilteredBlogs.length > 0 ? (
            finalFilteredBlogs.map((item) => (
              <BlogItem id={item._id} slug={item.slug} key={item._id} image={item.image} title={item.title} excerpt={item.excerpt} description={item.description} category={item.category} />
            ))
          ) : (
            <h6 className='text-center'>Blogs Not Found</h6>
          )}
        </div>
    </section>
  );
};

export default BlogList;
