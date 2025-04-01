import React from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css"; // External CSS file for styling

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      
      {/* Title */}
      <div className="title-container">Admin Dashboard</div>

      {/* Gradient Box with Options */}
      <div className="gradient-box">
      <Link to="/create-hr" className="text-decoration-none">
      <div className="option-box">Create HR Account</div>
      </Link>
        <Link to="/delete-job" className="text-decoration-none">
          <div className="option-box">Delete Job Posting</div>
        </Link>
        <Link to="/manage-categories" className="text-decoration-none">
        <div className="option-box">Manage Job Categories</div>
        </Link>

        <Link to="/reports" className="text-decoration-none">
          <div className="option-box">Report Generation</div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
