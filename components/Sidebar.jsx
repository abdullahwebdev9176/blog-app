'use client'

import Image from "next/image"
import Link from "next/link"
import { assets } from "@/Assets/assets"
import { useRouter } from "next/navigation"

const Sidebar = () => {
    const router = useRouter();

    return (
        <>
            <div className="admin-sidebar-box">
             
                
                <ul className="sidebar-list">
                    <li>
                        <Link href="/admin/PostsOverview">
                            <Image src={assets.blog_icon} alt="Posts Overview Icon" />
                            Posts Overview</Link>
                    </li>

                    <li>
                        <Link href="/admin/AddBlog">
                            <Image src={assets.add_icon} alt="Add Blog Icon" />
                            Add Blog</Link>
                    </li>

                    <li>
                        <Link href="/admin/BlogList">
                            <Image src={assets.blog_icon} alt="Blog List Icon" />
                            Blog List</Link>
                    </li>

                    <li>
                        <Link href="/admin/AddCategory">
                            <Image src={assets.add_icon} alt="Add Category Icon" />
                            Add Category</Link>
                    </li>

                    <li>
                        <Link href="/admin/CategoryList">
                            <Image src={assets.blog_icon} alt="Category List Icon" />
                            Category List</Link>
                    </li>

                    <li>
                        <Link href="/admin/CommentsManagement">
                            <Image src={assets.email_icon} alt="Comments Management Icon" />
                            Comments Management</Link>
                    </li>

                    <li>
                        <Link href="/admin/Subscription">
                            <Image src={assets.email_icon} alt="Subscription Icon" />
                            Subscription</Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar