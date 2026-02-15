import React from 'react';
import { Smile, Activity, Star, Clock, Brain, User } from 'lucide-react';
import './Services.css';

const servicesData = [
    {
        icon: <Smile size={40} />,
        title: 'General Dentistry',
        description: 'Routine check-ups, cleanings, and preventive care to keep your smile healthy and bright.'
    },
    {
        icon: <Star size={40} />,
        title: 'Cosmetic Dentistry',
        description: 'Transform your smile with veneers, whitening, and bonding treatments tailored to you.'
    },
    {
        icon: <Activity size={40} />,
        title: 'Emergency Care',
        description: 'Immediate attention for dental emergencies. We are here when you need us most.'
    },
    {
        icon: <Clock size={40} />,
        title: 'Orthodontics',
        description: 'Straighten your teeth with modern solutions including clear aligners and traditional braces.'
    },
    {
        icon: <Brain size={40} />,
        title: 'Periodontist',
        description: 'Specializes in treating diseases of the gums and supporting bone structures.'
    },

    {
        icon: <User size={40} />,
        title: 'Prosthodontist',
        description: 'Specializes in replacing missing teeth with restorations like dentures, bridges, and implants.'
    },

];

const Services = () => {
    return (
        <section className="services-section" id="services">
            <div className="container">
                <div className="section-header text-center mb-4">
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-subtitle">Comprehensive dental care for your entire family</p>
                </div>

                <div className="services-grid">
                    {servicesData.map((service, index) => (
                        <div className="service-card" key={index}>
                            <div className="service-icon">
                                {service.icon}
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <a href="/services" className="service-link">Learn More &rarr;</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
