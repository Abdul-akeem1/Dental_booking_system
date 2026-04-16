import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar } from "lucide-react";

const DentistSidebar = () => {
    const linkStyle = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "15px 25px",
        textDecoration: "none",
        color: isActive ? "#28a745" : "#333",
        backgroundColor: isActive ? "#f8f9fa" : "transparent",
        borderRight: isActive ? "3px solid #28a745" : "3px solid transparent",
        transition: "all 0.2s ease"
    });

    return (
        <div style={{
            width: "250px",
            height: "100vh",
            backgroundColor: "white",
            borderRight: "1px solid #eee",
            position: "fixed",
            top: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            zIndex: 1001
        }}>
            <div style={{
                padding: "20px",
                textAlign: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #eee"
            }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#333" }}>Dentist Panel</h2>
            </div>

            <nav style={{ flex: 1 }}>
                <NavLink to="/dentist/appointments" style={linkStyle}>
                    <Calendar size={20} /> My Appointments
                </NavLink>
                <NavLink to="/dentist/schedule" style={linkStyle}>
                    <LayoutDashboard size={20} /> View Schedule
                </NavLink>
            </nav>
        </div>
    );
};

export default DentistSidebar;
