import { generateMetadata as generateSEOMetadata, getCanonicalUrl } from "@/lib/utils/seo";

export const metadata = generateSEOMetadata({
  title: "About Us - Learn About Our Mission and Team",
  description: "Discover MyBlog's mission to empower readers with valuable content on technology, lifestyle, and startups. Meet our team of experienced writers and industry experts.",
  url: getCanonicalUrl('/about'),
  type: "website",
});

const AboutPage = () => {
  return (
    <article className="container text-center py-5">
      <header>
        <h1 className="mb-4">About Us</h1>
      </header>
      <section className="mb-4">
        <p>
          Welcome to MyBlog! We are passionate about sharing knowledge, stories, and insights on technology, lifestyle, startups, and more. Our mission is to empower readers with valuable content and inspire them to explore new ideas.
        </p>
      </section>
      <section className="mb-4">
        <p>
          Our team consists of experienced writers and industry experts who are dedicated to delivering high-quality articles and resources. Whether you're here to learn, get inspired, or stay updated, MyBlog is your go-to platform.
        </p>
      </section>
      <section>
        <p>
          Thank you for being a part of our community!
        </p>
      </section>
    </article>
  );
};

export default AboutPage;