import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 // Redirect already logged-in users
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "1") navigate("/admin-dashboard");
    else if (role === "2") navigate("/hr-dashboard");
    else if (role === "3") navigate("/applicant-dashboard");
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: password,
      });

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${response.data.user.name}`,
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role);
      localStorage.setItem("User_ID", response.data.user.id);

      // Redirect based on role
      if (response.data.user.role === 1) {
        navigate("/admin-dashboard");
      } else if (response.data.user.role === 2) {
        navigate("/hr-dashboard");
      } else {
        navigate("/applicant-dashboard");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid email or password",
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email or UserID
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
