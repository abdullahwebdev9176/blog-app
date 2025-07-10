"use client";
import { assets } from "@/Assets/assets";
import Image from "next/image";

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: "Nutrition",
      image: assets.blog_pic_4,
      link: "/category/nutrition",
    },
    {
      id: 2,
      name: "Fitness",
      image: assets.blog_pic_3,
      link: "/category/fitness",
    },
    {
      id: 3,
      name: "Mindfulness",
      image: assets.blog_pic_2,
      link: "/category/mindfulness",
    },
    {
      id: 4,
      name: "Recipes",
      image: assets.blog_pic_1,
      link: "/category/recipes",
    }
  ];

  return (
    <section className="categories-section py-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-success">Explore Categories</h2>
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <a href={category.link} className="text-decoration-none text-dark">
                <div className="card category-card h-100 shadow-sm">
                  <div className="image-wrapper">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={400}
                      height={300}
                      style={{ objectFit: "cover", width: "100%", height: "180px" }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-semibold">{category.name}</h5>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
