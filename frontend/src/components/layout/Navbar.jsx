import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, User, LogOut, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

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
          <a href="/#services" className="nav-link">
            Services
          </a>
          {/* <a href="/dentists" className="nav-link">
            Dentists
          </a> */}
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
          <a href="http://localhost:5173" className="btn btn-primary small-btn">
            <User size={18} className="icon-left" />
            Admin Panel
          </a>
          {/* {user ? (
            <div className="user-dropdown-container">
              <button
                className="user-icon-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/appointments" className="dropdown-item">
                    <Calendar size={16} /> My Appointments
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-item"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link login-link">
              Log in
            </Link>
          )} */}
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
          <a
            href="/#services"
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            Services
          </a>
          <Link
            to="/dentists"
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            Dentists
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
            <a
              href="http://localhost:5173"
              className="btn btn-primary full-width"
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
