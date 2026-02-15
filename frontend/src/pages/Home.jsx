import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Footer from '../components/layout/Footer';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className="home-page">
            <Navbar />
            <main>
                <Hero />
                <Services />
                {/* Additional sections like Testimonials, About Preview could go here */}
            </main>
            <Footer />
        </div>
    );
};

export default Home;
