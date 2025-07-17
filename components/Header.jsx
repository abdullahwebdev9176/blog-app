"use client";

import Image from 'next/image';
import Link from 'next/link';
import { assets } from "@/Assets/assets";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {

  const [mobileHeader, setMobileHeader] = useState(false);
  const router = useRouter();

  const toggleMobileHeader = () => {
    setMobileHeader(!mobileHeader);
  };



  return (
    <>

      <header className='desktop-header'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div className="container">
            <Link href="/" className="navbar-brand fw-bold text-primary">
              MyBlog
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link href="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link href="/about" className="nav-link">About</Link>
                </li>
                <li className="nav-item">
                  <Link href="/blog-posts" className="nav-link">Blog</Link>
                </li>
                <li className="nav-item">
                  <Link href="/contact" className="nav-link">Contact</Link>
                </li>
                <li className="nav-item">
                  <Link href="/privacy-policy" className="nav-link">Privacy Policy</Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin" className="nav-link">Admin</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>


      <header className="mobile-header">
        <div className="mobile-header-parent">
          <div className="mobile-header-img">
            <Link href="/"> <Image src={assets.logo} alt="" /></Link>
          </div>
          <div className="custom-toggle-icon" onClick={toggleMobileHeader}>
            {mobileHeader ? (
              <>
                <span className="fa fa-xmark"></span>
              </>
            ) : (
              <>
                <span className="fa fa-bars"></span>
              </>
            )}
          </div>
        </div>
      </header>      {mobileHeader && (
        <>
          <div className="mobile-header-list">
            <ul>
              {admin ? (
                // Admin is logged in - show only logout
                <li>
                  <button
                    onClick={handleLogout}
                    className="custom-nav-link btn btn-link text-danger"
                    style={{ textDecoration: 'none', border: 'none', background: 'none' }}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                // Admin is not logged in - show all navigation
                <>
                  <li>
                    <Link href="/" className="custom-nav-link" onClick={() => setMobileHeader(false)}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="custom-nav-link" onClick={() => setMobileHeader(false)}>
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-posts" className="custom-nav-link" onClick={() => setMobileHeader(false)}>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="custom-nav-link" onClick={() => setMobileHeader(false)}>
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="custom-nav-link" onClick={() => setMobileHeader(false)}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="custom-nav-link" onClick={() => setMobileHeader(false)}>
                      Admin
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}

    </>
  )
}

export default Header