"use client";
import { assets } from "@/Assets/assets";
import Image from "next/image";

const TrendingPostsSection = () => {
  const posts = [
    {
      id: 1,
      title: "Boost Your Morning Routine with These Simple Steps",
      excerpt: "Start your day with energy and clarity using these effective morning habits.",
      author: "Sarah Lee",
      image: assets.blog_pic_1,
      link: "/blog/morning-routine",
    },
    {
      id: 2,
      title: "Plant-Based Diet Benefits You Didn’t Know",
      excerpt: "Explore the surprising health benefits of going plant-based in your daily meals.",
      author: "David Kim",
      image: assets.blog_pic_2,
      link: "/blog/plant-based-benefits",
    },
    {
      id: 3,
      title: "Top 5 Yoga Poses for a Stronger Core",
      excerpt: "Strengthen your core and improve your balance with these simple yoga poses.",
      author: "Emily Brown",
      image: assets.blog_pic_3,
      link: "/blog/yoga-core",
    },
    {
      id: 4,
      title: "Healthy Smoothie Recipes to Try This Summer",
      excerpt: "Cool off and stay healthy with these delicious and easy smoothie recipes.",
      author: "John Doe",
      image: assets.blog_pic_4,
      link: "/blog/smoothie-recipes",
    },
  ];

  return (
    <section className="trending-posts py-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-primary">Trending Posts</h2>
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-12 col-sm-6 col-lg-3 mb-4">
              <div className="card post-card shadow-sm h-100">
                <div className="image-wrapper">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={500}
                    height={300}
                    style={{ objectFit: "cover", width: "100%", height: "200px" }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text flex-grow-1">{post.excerpt}</p>
                  <p className="text-muted small mb-2">By {post.author}</p>
                  <a href={post.link} className="btn btn-outline-primary mt-auto">
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

export default TrendingPostsSection;
