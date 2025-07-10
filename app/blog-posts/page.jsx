'use client'

import BlogList from '@/components/BlogList'
import React from 'react'

const page = () => {
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-10 mx-auto">
                        <BlogList />
                    </div>
                </div>
            </div>
        </>
    )
}

export default page