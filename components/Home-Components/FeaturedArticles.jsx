"use client";
import { assets } from "@/Assets/assets";
import Image from "next/image";

const FeaturedArticles = () => {

  const articles = [
    {
      id: 1,
      image: assets.blog_pic_1,
      title: "10 Superfoods to Boost Your Energy",
      excerpt: "Discover powerful foods that keep you energized and feeling your best throughout the day.",
      link: "#",
    },
    {
      id: 2,
      image: assets.blog_pic_2,
      title: "Beginner’s Guide to Meditation",
      excerpt: "Learn simple meditation techniques to reduce stress and improve mental clarity.",
      link: "#",
    },
    {
      id: 3,
      image: assets.blog_pic_3,
      title: "5 Quick Morning Workouts",
      excerpt: "Kickstart your day with these easy workouts that take less than 15 minutes.",
      link: "#",
    },
    {
      id: 4,
      image: assets.blog_pic_4,
      title: "Healthy Meal Prep Ideas",
      excerpt: "Save time and stay healthy with these simple meal prep strategies for the whole week.",
      link: "#",
    },
  ];

  return (
    <section className="featured-articles py-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-success">Featured Articles</h2>
        <div className="row">
          {articles.map((article) => (
            <div key={article.id} className="col-md-6 col-lg-3 mb-4">
              <div className="card article-card shadow-sm h-100">
                <div className="image-wrapper">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={500}
                    height={300}
                    style={{ objectFit: "cover", height: "200px", width: "100%" }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text flex-grow-1">{article.excerpt}</p>
                  <a href={article.link} className="btn btn-outline-success mt-auto">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
