import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Footer from '../components/layout/Footer';
import './AdminPage.css'

   <div className="adminPage-page">
            <Navbar />
            <main>
                <Hero />
                <Services />
                {/* see dentist schedule, update treatment plan etc */}
            </main>
            <Footer />
        </div>