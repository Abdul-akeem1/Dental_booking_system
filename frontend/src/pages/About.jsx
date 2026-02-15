import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Award, Users, Heart } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <Navbar />

            <main className="about-main">
                <section className="about-hero">
                    <div className="container">
                        <h1>About DentalCare</h1>
                        <p className="lead-text">Dedicated to providing exceptional dental care in a comfortable and modern environment.</p>
                    </div>
                </section>

                <section className="about-story container">
                    <div className="story-content">
                        <h2>Our Story</h2>
                        <p>
                            At DentalCare, we believe that a healthy smile is the foundation of well-being.
                            Established with a vision to bring world-class dental services to our community,
                            we have grown into a trusted center for comprehensive oral health.
                        </p>
                        <p>
                            Our clinic combines state-of-the-art technology with compassionate care.
                            Whether you are visiting for a routine check-up or a complex procedure,
                            our goal is to make your experience as comfortable and positive as possible.
                        </p>
                    </div>
                    <div className="story-image">
                        {/* Placeholder for clinic image */}
                        <div className="img-placeholder">Clinic Image</div>
                    </div>
                </section>

                <section className="about-values">
                    <div className="container">
                        <h2>Why Choose Us?</h2>
                        <div className="values-grid">
                            <div className="value-card">
                                <Award size={40} className="value-icon" />
                                <h3>Excellence</h3>
                                <p>We adhere to the highest standards of clinical excellence and hygiene.</p>
                            </div>
                            <div className="value-card">
                                <Users size={40} className="value-icon" />
                                <h3>Expert Team</h3>
                                <p>Our dentists and staff are highly trained and continuously educated.</p>
                            </div>
                            <div className="value-card">
                                <Heart size={40} className="value-icon" />
                                <h3>Compassion</h3>
                                <p>We treat every patient with kindness, respect, and understanding.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
