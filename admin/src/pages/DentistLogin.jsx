import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const DentistLogin = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Placeholder endpoint. Will be properly wired when you request the backend feature.
            const { data } = await axios.post("http://localhost:5000/api/dentist/login", {
                email,
                password,
            });

            if (data.message === "Dentist login successful") {
                localStorage.setItem("dentistToken", "true");
                setToken("true");
                toast.success("Login Successful");
            }
        } catch (error) {
            if (error.response) {
                toast.error("Waiting for backend route!");
            } else {
                toast.error("Login failed. Please try again.");
            }
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#e2f0ff" }}>
            <form onSubmit={handleSubmit} style={{ padding: "2rem", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "350px" }}>
                <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "#333" }}>Dentist Login</h2>
                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#666" }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#666" }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                </div>
                <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}>
                    Login as Dentist
                </button>
                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "14px" }}>
                    <p style={{ color: "#666" }}>
                        Switch to <Link to="/login" style={{ color: "#007bff", textDecoration: "underline", fontWeight: "bold" }}>Admin Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default DentistLogin;
