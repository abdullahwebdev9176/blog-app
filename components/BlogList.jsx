
"use client";

import { blog_data } from '@/Assets/assets'
import React, { useState } from 'react'
import BlogItem from './BlogItem'

const BlogList = () => {

  const [menu, setMenu] = useState("All");

  const filteredBlogs = blog_data.filter((item) =>
    menu === "All" ? true : item.category === menu
  );


  return (
    <>
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
            {
              filteredBlogs.length > 0 ?
                (filteredBlogs.map((item, index) => {
                  return <BlogItem key={index} image={item.image} title={item.title} description={item.description} category={item.category} />
                }))
                :
                (<>
                  <h6 className='text-center'>Blogs Not Found</h6>
                </>)

            }
          </div>
        </div>
      </section>

    </>
  )
}

export default BlogList