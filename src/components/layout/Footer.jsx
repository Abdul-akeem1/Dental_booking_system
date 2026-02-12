import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-col">
                    <h3 className="footer-logo">
                        <span className="logo-icon">🦷</span> DentalCare
                    </h3>
                    <p className="footer-text">
                        Providing exceptional dental care for the whole family. We are committed to your oral health and beautiful smile.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-link"><Facebook size={20} /></a>
                        <a href="#" className="social-link"><Instagram size={20} /></a>
                        <a href="#" className="social-link"><Twitter size={20} /></a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/portal">Patient Portal</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Contact Info</h4>
                    <ul className="contact-list">
                        <li>
                            <MapPin size={18} className="contact-icon" />
                            <span>Main Street, Letterkenny, Co. Donegal</span>
                        </li>
                        <li>
                            <Phone size={18} className="contact-icon" />
                            <span>(01) 825 6262</span>
                        </li>
                        <li>
                            <Mail size={18} className="contact-icon" />
                            <span>info@dentalcare.ie</span>
                        </li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Opening Hours</h4>
                    <ul className="hours-list">
                        <li><span>Mon - Fri:</span> <span>9:00 AM - 6:00 PM</span></li>
                        <li><span>Saturday:</span> <span>9:00 AM - 2:00 PM</span></li>
                        <li><span>Sunday:</span> <span>Closed</span></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} DentalCare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
