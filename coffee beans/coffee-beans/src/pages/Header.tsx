import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext"; // adjust path if needed

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { lines = [] } = useCart?.() ?? ({ lines: [] } as any);
  const cartCount = Array.isArray(lines)
    ? lines.reduce((s: number, l: any) => s + (Number(l.qty ?? 1) || 1), 0)
    : 0;

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
        <nav className="header-nav">
          <Link to="/" className="header-link">HOME</Link>
          <Link to="/products" className="header-link">PRODUCTS</Link>
          <Link to="/cart" className="header-link">CART</Link>
          <Link to="/contact" className="header-link">CONTACT</Link>
        </nav>

        {/* Right actions: login → cart → hamburger */}
        <div className="header-actions">
          <Link to="/auth" className="header-login">LOG IN</Link>

          <Link to="/cart" className="header-cart" aria-label="Cart">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="cart-icon">
              <path
                d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Hamburger / Close */}
          <button
            className={`header-burger ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {/* 3 lines */}
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
            {/* X icon overlay when open (accessible but decorative) */}
            <svg className="burger-x" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div id="mobile-menu" className="mobile-panel" aria-hidden={!open}>
        <Link to="/" className="mobile-link" onClick={() => setOpen(false)}>HOME</Link>
        <Link to="/products" className="mobile-link" onClick={() => setOpen(false)}>PRODUCTS</Link>
        <Link to="/cart" className="mobile-link mobile-cart" onClick={() => setOpen(false)}>
          CART {cartCount > 0 && <span className="mobile-cart-count">{cartCount}</span>}
        </Link>
        <Link to="/contact" className="mobile-link" onClick={() => setOpen(false)}>CONTACT</Link>
        <Link to="/auth" className="mobile-link mobile-login" onClick={() => setOpen(false)}>LOG IN</Link>
      </div>
    </header>
  );
};

export default Header;
