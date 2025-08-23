import React from "react";
import beansTop from "../assets/beans4.png";
import heroImg from "../assets/hero4.png";
import Header from "./Header";

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
            <button className="hero-btn">Order now</button>
          </div>

          {/* Right 50%: image (hidden on mobile via CSS) */}
          <div className="hero-image">
            <img
              src={heroImg}
              alt="Coffee with cookies"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* Bottom beans strip */}
      <footer className="relative w-full m-0 p-0">
        <img
          src={beansTop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 block w-full h-[150px] object-cover rotate-180 select-none"
          draggable={false}
        />
        <div className="relative flex h-[150px] items-center justify-center text-black">
          <p className="text-sm md:text-base font-medium">
            © 2025 Coffee Beans. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
