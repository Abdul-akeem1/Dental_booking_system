import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, User } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🦷</span>
          <span className="logo-text">DentalCare</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/services" className="nav-link">
            Services
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </div>

        <div className="navbar-actions desktop-only">
          <a href="tel:+35318256262" className="btn btn-outline small-btn">
            <Phone size={18} className="icon-left" />
            (01) 825 6262
          </a>
          <Link to="/portal" className="btn btn-primary small-btn">
            <User size={18} className="icon-left" />
            Portal
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link
            to="/services"
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/about"
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <div className="mobile-actions">
            <Link
              to="/portal"
              className="btn btn-primary full-width"
              onClick={() => setIsOpen(false)}
            >
              Patient Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
