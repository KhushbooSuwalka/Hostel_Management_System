// import { useState } from 'react'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

{/* Pages */ }

import Admin from "./pages/Admin";
import Grievance from "./pages/Grievance";
import RoomAllotment from "./pages/RoomAllotment";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
{/* Components */ }
import Header from "./components/Header";
import Footer from "./components/Footer";
import SetPassword from "./pages/SetPassword";
import './index.css';

function App() {
  return (
  <Router>
    <Header />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/grievance" element={<Grievance />} />
      <Route path="/room" element={<RoomAllotment />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/set-password" element={<SetPassword />} />
    </Routes>

    <Footer />
  </Router>
  );
}

export default App

