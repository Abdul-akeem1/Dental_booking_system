import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Footer from '../components/layout/Footer';

const Home = () => {
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
