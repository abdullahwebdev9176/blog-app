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
                        <Image src={assets.add_icon} />
                        Add Blog</Link>
                </li>

                <li>
                    <Link href="/admin/BlogList">
                        <Image src={assets.blog_icon} />
                        Blog List</Link>
                </li>

                <li>
                    <Link href="/admin/Subscription">
                        <Image src={assets.email_icon} />
                        Subscription</Link>
                </li>

            </ul>
            </div>

        </>
    )
}

export default Sidebar