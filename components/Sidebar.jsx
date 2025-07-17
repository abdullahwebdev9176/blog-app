'use client'

import Image from "next/image"
import Link from "next/link"
import { assets } from "@/Assets/assets"
import { useRouter, usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
    faChartLine, 
    faPlus, 
    faList, 
    faTags, 
    faComments, 
    faEnvelope,
    faHome,
    faEdit
} from "@fortawesome/free-solid-svg-icons"
import "./Sidebar.css"

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        {
            href: "/admin/PostsOverview",
            icon: faChartLine,
            label: "Posts Overview",
            description: "View all posts analytics"
        },
        {
            href: "/admin/AddBlog",
            icon: faPlus,
            label: "Add Blog",
            description: "Create new blog post"
        },
        {
            href: "/admin/BlogList",
            icon: faList,
            label: "Blog List",
            description: "Manage all blog posts"
        },
        {
            href: "/admin/AddCategory",
            icon: faTags,
            label: "Add Category",
            description: "Create new category"
        },
        {
            href: "/admin/CategoryList",
            icon: faEdit,
            label: "Category List",
            description: "Manage categories"
        },
        {
            href: "/admin/CommentsManagement",
            icon: faComments,
            label: "Comments",
            description: "Manage user comments"
        },
        {
            href: "/admin/Subscription",
            icon: faEnvelope,
            label: "Subscriptions",
            description: "Email subscriptions"
        }
    ];

    const isActiveRoute = (href) => {
        return pathname === href;
    };

    return (
        <>
            <div className="modern-sidebar">
                <div className="sidebar-header">
                    <Link href="/admin" className="sidebar-brand">
                        <FontAwesomeIcon icon={faHome} className="brand-icon" />
                        <span className="brand-text">Admin Panel</span>
                    </Link>
                </div>
                
                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {menuItems.map((item) => (
                            <li key={item.href} className="nav-item">
                                <Link 
                                    href={item.href}
                                    className={`nav-link ${isActiveRoute(item.href) ? 'active' : ''}`}
                                >
                                    <div className="nav-icon">
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>
                                    <div className="nav-content">
                                        <span className="nav-label">{item.label}</span>
                                        <span className="nav-description">{item.description}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Sidebar