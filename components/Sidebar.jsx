'use client'

import Image from "next/image"
import Link from "next/link"
import { assets } from "@/Assets/assets"

const Sidebar = () => {
    return (
        <>
            <div className="admin-sidebar-box">
                <ul className="sidebar-list">


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