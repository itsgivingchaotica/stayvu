import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Listings from "./pages/Listings";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import IndividualListings from "./pages/IndividualListings";
import Policies from "./pages/Policies";

function App() {
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL =
    import.meta.env.VITE_MODE === "production"
      ? import.meta.env.VITE_SERVER_URL
      : "http://localhost:3001";

  console.log('MODE:', import.meta.env.MODE);
  console.log('VITE_MODE:', import.meta.env.VITE_MODE);
  console.log('VITE_SERVER_URL:', import.meta.env.VITE_SERVER_URL);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch(`${API_URL}/api`);
      const data = await response.json();
      setListings(data);
    };
    fetchListings();
  }, []);

  return (
    <div className="App">
      <Router>
        <header>
          <Navbar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </header>
        <div
          className={`main-content ${
            isModalOpen ? "blur-3xl bg-white/30" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<Listings data={listings} />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/policy" element={<Policies />} />
            <Route path="/listings/:id" component={IndividualListings} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
