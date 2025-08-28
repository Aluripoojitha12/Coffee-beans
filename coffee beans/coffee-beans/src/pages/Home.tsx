import React from "react";
import beansTop from "../assets/beans4.png";
import heroImg from "../assets/hero4.png";
import Header from "./Header";
import ProductsGrid from "../components/ProductsGrid";
import product1 from "../assets/product1.png";
import product2 from "../assets/product2.png";
import product3 from "../assets/product3.png";
import footerBg from "../assets/footer1.jpg"; // 👈 new footer background
/* NEW: assets for the promo section */
import promoBg from "../assets/beansbg_mbl3.jpg"; // background for the 2nd section
import welcomeImg from "../assets/white_cup_with_beans.png"; // left image in promo
import { Link } from "react-router-dom";
const Home: React.FC = () => {
  return (
    <main className="w-full overflow-hidden m-0 p-0">
      {/* Top beans strip */}
      <img
        src={beansTop}
        alt="Top coffee beans"
        className="block w-full h-[180px] object-cover select-none"
        draggable={false}
      />

      {/* HERO (black card) */}
      <section className="hero relative">
      {/* Header sits on top of the hero */}
      <Header />

      <div className="hero-container">
        {/* Left 50%: text */}
        <div className="hero-text">
          <h1>
            START YOUR DAY <br /> WITH COFFEE
          </h1>
          <Link to="/products">
            <button className="hero-btn">Order now</button>
          </Link>
        </div>

        {/* Right 50%: image (hidden on mobile via CSS) */}
        <div className="hero-image">
          <img src={heroImg} alt="Coffee with cookies" draggable={false} />
        </div>
      </div>
    </section>

      {/* ===== 2) PROMO SECTION (WELCOME) ===== */}
      <section
        className="promo"
        style={{ "--promo-bg": `url(${promoBg})` } as React.CSSProperties}
      >
        <div className="promo-inner">
          {/* Coffee colored card with two columns */}
          <div className="promo-card">
            <div className="promo-grid">
              {/* Left: image */}
              <div className="promo-visual">
                <img
                  src={welcomeImg}
                  alt="Welcome to Coffee Beans"
                  draggable={false}
                />
              </div>

              {/* Right: content */}
              <div className="promo-copy">
                <h2 className="promo-heading">WELCOME</h2>
                <p>
                  Welcome to <strong>Coffee Beans</strong> — your daily dose of
                  warmth and aroma. From carefully sourced beans to expert
                  roasts, we craft each cup to spark your day. Explore our
                  brews, learn about our process, and discover your next
                  favorite coffee. Sit back, sip, and enjoy!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3) PRODUCTS SECTION ===== */}
      <section
        className="products"
        style={{ "--products-bg": `url(${promoBg})` } as React.CSSProperties}
      >
        <div className="products-inner">
          <div className="products-card">
            <h2 className="products-title">OUR PRODUCT</h2>

            <ProductsGrid
              items={[
                {
                  id: "ethiopia",
                  name: "Ethiopia Roast",
                  image: product1,
                  priceIndividual: 12.5,
                  priceBulk: 10.99,
                  blurb: "Floral • Citrus • Honey",
                  rating: 5,
                },
                {
                  id: "colombia",
                  name: "Colombia Supremo",
                  image: product2,
                  priceIndividual: 11.75,
                  priceBulk: 9.95,
                  blurb: "Caramel • Nutty • Smooth",
                  rating: 4,
                },
                {
                  id: "house",
                  name: "House Blend",
                  image: product3,
                  priceIndividual: 10.5,
                  priceBulk: 8.99,
                  blurb: "Balanced • Everyday Cup",
                  rating: 5,
                },
              ]}
            />

            {/* Centered View More button */}
            <div className="products-more">
              <Link to="/products" className="view-more-btn">
                View more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER SECTION ===== */}
<section
  className="footer-section"
  style={
    {
      "--footer-bg": `url(${footerBg})`,
    } as React.CSSProperties
  }
>
  <div className="footer-inner">
    <div className="footer-card">
      <h2 className="footer-title">The Flavor Of Coffee</h2>
      <p className="footer-subtitle">That Brings Life To Your Body</p>

      <div className="footer-grid">
        <div>
          <h3 className="footer-heading">Contacts</h3>
          <p>123 Coffee Street, Chicago</p>
          <p>+1 212 456 7890</p>
          <p>shop@coffeebeans.com</p>
        </div>

        <div>
          <h3 className="footer-heading">Information</h3>
          <ul>
            <li>About Us</li>
            <li>Shop</li>
            <li>Our Process</li>
            <li>Gift Packs</li>
          </ul>
        </div>

        <div>
          <h3 className="footer-heading">Support</h3>
          <ul>
            <li>FAQ</li>
            <li>Shipping</li>
            <li>Returns</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2025 Coffee Beans. All Rights Reserved.</p>
    </div>
  </div>
</section>

{/* ===== Beans strip BELOW the footer (as a separate strip) ===== */}
<div className="footer-beans-strip">
  <img
    src={beansTop}
    alt="Coffee beans strip"
    aria-hidden="true"
    draggable={false}
  />
</div>
    </main>
  );
};

export default Home;
