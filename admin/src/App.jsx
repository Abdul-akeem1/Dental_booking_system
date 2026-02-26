import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import AllAppointments from "./pages/AllAppointments";
import AddDentist from "./pages/AddDentist";
import DentistList from "./pages/DentistList";
import AddClient from "./pages/AddClient";



const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        {token ? (
          <>
            <Navbar setToken={setToken} />
            <Sidebar />
            <div style={{ marginLeft: "250px", marginTop: "60px", padding: "2rem" }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/appointments" element={<AllAppointments />} />
                <Route path="/add-dentist" element={<AddDentist />} />
                <Route path="/dentists" element={<DentistList />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
