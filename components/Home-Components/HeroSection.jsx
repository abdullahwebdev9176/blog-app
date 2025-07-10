'use client'

import Link from 'next/link'
import React from 'react'

const HeroSection = () => {
    return (
        <>
            <section className="hero-section">
                <div className="hero-content container text-center text-white">
                    <h1 className="display-4 fw-bold">Embrace a Healthier You</h1>
                    <p className="lead mb-4">Discover expert tips, delicious recipes, and fitness guides to transform your wellness journey.</p>
                    <Link href="/blog-posts" className="btn btn-primary btn-lg shadow">Explore Articles</Link>
                </div>
            </section>
        </>
    )
}

export default HeroSection