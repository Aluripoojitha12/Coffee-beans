import React, { useState, useEffect, useRef } from "react";
import "./Header.css";

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
        <a href="/" className="header-logo">LOGO HERE</a>

        {/* Desktop nav */}
        <nav className="header-nav">
          <a href="/" className="header-link">HOME</a>
          <a href="/about" className="header-link">ABOUT</a>
          <a href="/blogs" className="header-link">BLOGS</a>
          <a href="/contact" className="header-link">CONTACT</a>
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
