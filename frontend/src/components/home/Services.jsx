import React from 'react';
import { ClipboardList, Sparkles, Sun, ShieldCheck, Activity, Stethoscope } from 'lucide-react';
import './Services.css';

export const servicesData = [
    {
        icon: <ClipboardList size={40} />,
        title: 'Consultation',
        description: 'Comprehensive examination to assess your oral health and discuss personalized treatment plans.'
    },
    {
        icon: <Sparkles size={40} />,
        title: 'Cleaning',
        description: 'Professional plaque and tartar removal, followed by polishing for a brighter, healthier smile.'
    },
    {
        icon: <Sun size={40} />,
        title: 'Teeth Whitening',
        description: 'Effective and safe professional teeth whitening to remove stains and dramatically brighten your teeth.'
    },
    {
        icon: <ShieldCheck size={40} />,
        title: 'Fillings',
        description: 'Tooth-colored composite restorations to repair cavities, restore tooth function, and prevent further decay.'
    },
    {
        icon: <Activity size={40} />,
        title: 'Root Canal',
        description: 'Expert endodontic therapy designed to save an infected tooth and relieve severe toothache.'
    },
    {
        icon: <Stethoscope size={40} />,
        title: 'Extraction',
        description: 'Safe and virtually painless tooth removal procedures, including wisdom teeth extractions.'
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
