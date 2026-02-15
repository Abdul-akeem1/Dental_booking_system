import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="hero-title">
                    Experience Excellence in <br />
                    <span className="highlight">Dental Care</span>
                </h1>
                <p className="hero-subtitle">
                    Advanced technology, compassionate care, and a team dedicated to your smile.
                    Serving the Ratoath community with pride.
                </p>
                <div className="hero-buttons">
                    <button className="btn btn-primary hero-btn">
                        <Calendar size={20} className="icon-left" />
                        Book Appointment
                    </button>
                    <button className="btn btn-outline hero-btn">
                        Our Services
                        <ArrowRight size={20} className="icon-right" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
