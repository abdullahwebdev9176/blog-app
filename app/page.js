"use client";

import AboutAuthorSection from "@/components/Home-Components/AboutAuthor";
import BlogShowcase from "@/components/Home-Components/BlogShowcase";
import CategoriesSection from "@/components/Home-Components/CategoriesSection";
import FeaturedArticles from "@/components/Home-Components/FeaturedArticles";
import HeroSection from "@/components/Home-Components/HeroSection";
import TestimonialsSection from "@/components/Home-Components/Testimonial";
import TrendingPostsSection from "@/components/Home-Components/TrendingPost";
import NewsletterForm from "@/components/NewsletterForm";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section>
        <FeaturedArticles />
      </section>

      <section>
        <BlogShowcase />
      </section>
      {/* <section>
        <CategoriesSection />
      </section> */}
      <section>
        <TrendingPostsSection />
      </section>
      <section>
        <AboutAuthorSection />
      </section>
      <section>
        <TestimonialsSection />
      </section>
      <section>
        <NewsletterForm />
      </section>
    </>
  );
}
