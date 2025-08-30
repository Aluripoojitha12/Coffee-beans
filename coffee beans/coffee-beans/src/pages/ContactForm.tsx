import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";                         // ✅ your header
import Footer from "../components/footer/footer";      // ✅ your footer
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaPaperPlane,
} from "react-icons/fa";
import contactVideo from "../assets/coffee_beans_video.mp4";   // ⬅️ put your video in assets
import "./contact.css";

export default function ContactForm() {
  // same functionality
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thanks for reaching out! We'll get back to you soon ☕");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Header />
      {/* 👉 Spacer to prevent header overlap on mobile (same utility used on Products/Cart) */}
      <div className="page-header-spacer" aria-hidden />

      <div className="pp-footer-override">
        {/* ===== HERO (video background) ===== */}
        <section className="contact-hero">
          <video
            className="contact-hero__video"
            src={contactVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="contact-hero__overlay" />
          <div className="container hero-center contact-hero__inner">
            <h1>Contact Us</h1>
            <p className="breadcrumb">
              <Link to="/" className="crumb-link">Home</Link>
              <span>/</span>
              <strong>Contact Us</strong>
            </p>
          </div>
        </section>

        {/* ===== MAIN CONTENT ===== */}
        <section className="contact-wrap">
          <div className="container contact-grid">
            {/* LEFT FORM */}
            <div className="form-col">
              <p className="eyebrow">— CONTACT US</p>

              {/* Short quote (as requested) */}
              <h2 className="headline">Shop Fresh <span className="accent">Coffee Beans</span></h2>

              <form onSubmit={handleSubmit} className="form" /* add form--dark if you switch to dark bg */>
                <div className="row two">
                  <div className="field">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Ex. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      aria-label="Your Name"
                      autoComplete="name"
                    />
                  </div>
                  <div className="field">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      aria-label="Email"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Order inquiry / Wholesale / Other"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      aria-label="Subject"
                      autoComplete="on"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label>Your Message *</label>
                    <textarea
                      name="message"
                      placeholder="Type your message here..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      aria-label="Your Message"
                      autoComplete="on"
                    />
                  </div>
                </div>

                <div className="actions">
                  <button type="submit" className="send-btn">
                    <span className="circle"><FaPaperPlane /></span>
                    <span className="text">Send Message</span>
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT INFO CARD */}
            <aside className="info-card">
              <div className="card-inner">
                <div className="block">
                  <h3>Address</h3>
                  <p className="muted">
                    4517 Coffee Street<br />Brewtown, Latte 39495
                  </p>
                </div>

                <div className="block">
                  <h3>Contact</h3>
                  <p className="muted">
                    Phone : +0123-456-789<br />
                    Email : hello@coffeebeans.com
                  </p>
                </div>

                <div className="block">
                  <h3>Open Time</h3>
                  <p className="muted">
                    Monday – Friday : 9:00 – 21:00<br />
                    Saturday – Sunday : 10:00 – 19:00
                  </p>
                </div>

                <div className="block">
                  <h3>Stay Connected</h3>
                  <div className="social">
                    {/* real links (open in new tab) */}
                    <a aria-label="facebook" href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a aria-label="twitter" href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    <a aria-label="pinterest" href="https://pinterest.com" target="_blank" rel="noopener noreferrer"><FaPinterestP /></a>
                    <a aria-label="instagram" href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                  </div>
                </div>
              </div>

              {/* decorative icons */}
              <div className="card-bullets">
                <span><FaMapMarkerAlt /></span>
                <span><FaPhoneAlt /></span>
                <span><FaEnvelope /></span>
              </div>
            </aside>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
