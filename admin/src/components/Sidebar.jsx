import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, UserPlus, Users } from "lucide-react";

const Sidebar = () => {
    const linkStyle = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "15px 25px",
        textDecoration: "none",
        color: isActive ? "#007bff" : "#333",
        backgroundColor: isActive ? "#f8f9fa" : "transparent",
        borderRight: isActive ? "3px solid #007bff" : "3px solid transparent",
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
                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#333" }}>Admin Panel</h2>
            </div>

            <nav style={{ flex: 1 }}>
                <NavLink to="/" style={linkStyle}>
                    <LayoutDashboard size={20} /> Dashboard
                </NavLink>
                <NavLink to="/appointments" style={linkStyle}>
                    <Calendar size={20} /> Appointments
                </NavLink>
                <NavLink to="/add-dentist" style={linkStyle}>
                    <UserPlus size={20} /> Add Dentist
                </NavLink>
                <NavLink to="/dentists" style={linkStyle}>
                    <Users size={20} /> Dentist List
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
