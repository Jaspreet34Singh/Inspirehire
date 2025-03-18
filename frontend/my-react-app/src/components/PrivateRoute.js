import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  // Get user authentication status & role from localStorage
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role is not authorized, redirect to home
  if (!allowedRoles.includes(parseInt(userRole))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
