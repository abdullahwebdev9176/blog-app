"use client";
import { assets } from "@/Assets/assets";
import Image from "next/image";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Emily Johnson",
      role: "Fitness Enthusiast",
      image: assets.profile_icon,
      feedback: "I love reading these blog posts! They are so easy to follow and have helped me feel healthier and more energetic every day.",
    },
    {
      id: 2,
      name: "Michael Smith",
      role: "Nutrition Coach",
      image: assets.profile_icon,
      feedback: "Such great advice and practical tips! The articles are always well-researched and inspiring. Highly recommend this blog.",
    },
    {
      id: 3,
      name: "Sophia Lee",
      role: "Yoga Instructor",
      image: assets.profile_icon,
      feedback: "The mindfulness and wellness tips have completely changed the way I approach my daily routine. Thank you for sharing such valuable content!",
    },
  ];

  return (
    <section className="testimonials-section py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-primary">What Readers Are Saying</h2>
        <div className="row">
          {testimonials.map((t) => (
            <div key={t.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card testimonial-card h-100 shadow-sm text-center p-3">
                <div className="d-flex justify-content-center mb-3">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={80}
                    height={80}
                    className="rounded-circle border border-2 border-primary shadow-sm"
                  />
                </div>
                <h5 className="fw-semibold">{t.name}</h5>
                <p className="text-muted small">{t.role}</p>
                <p className="testimonial-text mt-2">"{t.feedback}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
