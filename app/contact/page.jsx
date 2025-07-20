'use client';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateMetadata as generateSEOMetadata, getCanonicalUrl } from "@/lib/utils/seo";

// Note: For client components, we need to handle metadata differently
// This will be handled by adding metadata in a parent server component

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      const res = await axios.post("/api/contact", formData);
      if (res.data.success) {
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(res.data.error || "Failed to send message");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="contact-form py-5">
      <header className="mb-4 text-center">
        <h1>Contact Us</h1>
        <p>Get in touch with our team. We'd love to hear from you!</p>
      </header>
      <section className="container">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="contact-name" className="form-label">Name</label>
            <input 
              id="contact-name"
              type="text" 
              className="form-control" 
              placeholder="Your Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              aria-describedby="name-help"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contact-email" className="form-label">Email</label>
            <input 
              id="contact-email"
              type="email" 
              className="form-control" 
              placeholder="Your Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              aria-describedby="email-help"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contact-message" className="form-label">Message</label>
            <textarea 
              id="contact-message"
              className="form-control" 
              rows="4" 
              placeholder="Your Message" 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              required
              aria-describedby="message-help"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            aria-describedby="submit-help"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </article>
  );
};

export default ContactPage;