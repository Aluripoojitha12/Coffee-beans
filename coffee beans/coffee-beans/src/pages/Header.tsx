import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  // Close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={`header ${open ? "open" : ""}`}>
      <div className="header-inner" ref={panelRef}>
        {/* Logo */}
        <Link to="/" className="header-logo">LOGO HERE</Link>

        {/* Desktop nav */}
        {/* import { Link } from "react-router-dom"; */}

<nav className="header-nav">
  <Link to="/" className="header-link">HOME</Link>
  <Link to="/products" className="header-link">PRODUCTS</Link>
  <Link to="/cart" className="header-link">CART</Link>
  <Link to="/contact" className="header-link">CONTACT</Link>
</nav>


        {/* Desktop login */}
        <a href="/auth" className="header-login">LOG IN</a>


        {/* Mobile hamburger */}
        <button
          className="header-burger"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div id="mobile-menu" className="mobile-panel" aria-hidden={!open}>
        <a href="/" className="mobile-link" onClick={() => setOpen(false)}>HOME</a>
        <a href="/about" className="mobile-link" onClick={() => setOpen(false)}>ABOUT</a>
        <a href="/blogs" className="mobile-link" onClick={() => setOpen(false)}>BLOGS</a>
        <a href="/contact" className="mobile-link" onClick={() => setOpen(false)}>CONTACT</a>
        <a href="/login" className="mobile-link mobile-login" onClick={() => setOpen(false)}>LOG IN</a>
      </div>
    </header>
  );
};

export default Header;
