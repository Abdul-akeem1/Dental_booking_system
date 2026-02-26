import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setToken }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        setToken("");
        window.location.href = "http://localhost:3000";
    };

    return (
        <nav style={{
            height: "60px",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
            borderBottom: "1px solid #eee",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            marginLeft: "250px" // Offset for sidebar
        }}>
            <div onClick={() => navigate('/')} style={{ fontWeight: 700, fontFamily: "Inter, system-ui, sans-serif", fontSize: "1.5rem", color: "#155e75", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="logo-icon" style={{ fontSize: "1.8rem" }}>🦷</span>
                <span className="logo-text">DentalCare</span>
            </div>
            <button onClick={handleLogout} style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer"
            }}>
                Logout <LogOut size={16} />
            </button>
        </nav>
    );
};

export default Navbar;
