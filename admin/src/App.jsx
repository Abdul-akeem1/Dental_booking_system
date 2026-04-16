import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DentistLogin from "./pages/DentistLogin";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DentistNavbar from "./components/DentistNavbar";
import DentistSidebar from "./components/DentistSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Dentists from "./pages/Dentists";
import Treatments from "./pages/Treatments";
import Schedule from "./pages/Schedule";
import DentistAppointments from "./pages/DentistAppointments";
import DentistSchedule from "./pages/DentistSchedule";



const App = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [dentistToken, setDentistToken] = useState(localStorage.getItem("dentistToken") || "");

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        {adminToken ? (
          <>
            <Navbar setToken={setAdminToken} />
            <Sidebar />
            <div style={{ marginLeft: "250px", marginTop: "60px", padding: "2rem" }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/dentists" element={<Dentists />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/schedule" element={<Schedule />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </>
        ) : dentistToken ? (
          <>
            <DentistNavbar setToken={setDentistToken} />
            <DentistSidebar />
            <div style={{ marginLeft: "250px", marginTop: "60px", padding: "2rem" }}>
              <Routes>
                <Route path="/dentist/appointments" element={<DentistAppointments />} />
                <Route path="/dentist/schedule" element={<DentistSchedule />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dentist/appointments" />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setToken={setAdminToken} />} />
            <Route path="/dentist-login" element={<DentistLogin setToken={setDentistToken} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
