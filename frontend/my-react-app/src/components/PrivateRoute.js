import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  // Get user authentication status & role from localStorage
  const token = localStorage.getItem("token");
  const userRole = parseInt(localStorage.getItem("userRole"), 10);
  const id = localStorage.getItem("ID");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role is not authorized, redirect to home
  if (!allowedRoles.includes(parseInt(userRole))) {
    return <Navigate to="/" replace />;
  }

  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
