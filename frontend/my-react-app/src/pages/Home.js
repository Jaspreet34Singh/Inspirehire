import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (role === "1") {
      navigate("/admin-dashboard"); // Admin
    } else if (role === "2") {
      navigate("/hr-dashboard"); // HR
    } else if (role === "3") {
      navigate("/applicant-dashboard"); // Applicant
    } else {
      navigate("/login"); // Default to login if no role is found
    }
  }, [navigate]);

  return null; // No UI needed, as we are redirecting
};

export default Home;
