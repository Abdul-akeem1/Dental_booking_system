import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import "./Contact.css";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    alert("Thank you for your message. We will get back to you shortly.");
  };

  return (
    <div className="contact-page">
      <Navbar />

      <main className="contact-main">
        <section className="contact-hero">
          <div className="container">
            <h1>Contact Us</h1>
            <p className="lead-text">
              Get in touch to book an appointment or ask any questions.
            </p>
          </div>
        </section>

        <div className="container contact-content">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p className="info-intro">
              We look forward to welcoming you to our clinic.
            </p>

            <div className="info-item">
              <MapPin className="info-icon" size={24} />
              <div>
                <h3>Location</h3>
                <p>Main Street, DentalCare, LetterKenny, Co. Donegal</p>
              </div>
            </div>

            <div className="info-item">
              <Phone className="info-icon" size={24} />
              <div>
                <h3>Phone</h3>
                <p>(01) 825 6262</p>
              </div>
            </div>

            <div className="info-item">
              <Mail className="info-icon" size={24} />
              <div>
                <h3>Email</h3>
                <p>info@dentalcare.ie</p>
              </div>
            </div>

            <div className="info-item">
              <Clock className="info-icon" size={24} />
              <div>
                <h3>Opening Hours</h3>
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="(08X) XXX XXXX" />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="How can we help you today?"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
