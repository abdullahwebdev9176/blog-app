"use client";

import Link from 'next/link';

const Header = () => {
  return (
    <>

      <header>
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
            </button>

            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link href="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link href="/about" className="nav-link">About</Link>
                </li>
                <li className="nav-item">
                  <Link href="/blog" className="nav-link">Blog</Link>
                </li>
                <li className="nav-item">
                  <Link href="/contact" className="nav-link">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

    </>
  )
}

export default Header