
"use client";

import { blog_data } from '@/Assets/assets'
import React, { use, useEffect, useState } from 'react'

const Page = ({params}) => {
    const { id } = use(params);

    const [blogData, setBlogData] = useState(null)

    const fetchBlogData = ()=>{

        const data =  blog_data.find((item)=>{
            return Number(id) === item.id
        })

        if(data){
            setBlogData(data);
            console.log(data)
        }
        
    }

    useEffect(()=>{
        fetchBlogData()
    },[id])
  return (
    <>
        <h6>{id}</h6>
    </>
  )
}

export default Page