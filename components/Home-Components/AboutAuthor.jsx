"use client";
import { assets } from "@/Assets/assets";
import Image from "next/image";

const AboutAuthorSection = () => {
  return (
    <section className="about-author-section py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-success">About the Author</h2>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 text-center">
            <Image
              src={assets.profile_icon}
              alt="Author"
              width={200}
              height={200}
              className="rounded-circle border border-3 border-success shadow-sm"
            />
            <h4 className="mt-3 fw-semibold">Hafsa</h4>
            <p className="text-muted">Health Blogger & Nutritionist</p>
            <p className="mt-3">
              Hafsa is a passionate health enthusiast who loves to share tips on nutrition, mindfulness, and fitness. Her goal is to inspire readers to live healthier and happier lives through practical advice and easy-to-follow guides.
            </p>
            <div className="social-icons mt-3">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="me-3 text-success fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="me-3 text-success fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" className="text-success fs-5">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAuthorSection;
