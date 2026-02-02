import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginIn from "./pages/LoginIn";
import ScrollToTop from "./components/layout/ScrollToTop";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginIn />} />
          {/* Placeholder routes for now */}
          <Route path="/portal" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
