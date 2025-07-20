// app/contact/layout.jsx
import { generateMetadata as generateSEOMetadata, getCanonicalUrl } from "@/lib/utils/seo";

export const metadata = generateSEOMetadata({
  title: "Contact Us - Get in Touch",
  description: "Have questions or feedback? Contact our team at MyBlog. We'd love to hear from you and help with any inquiries about our content and services.",
  url: getCanonicalUrl('/contact'),
  type: "website",
});

export default function ContactLayout({ children }) {
  return children;
}
