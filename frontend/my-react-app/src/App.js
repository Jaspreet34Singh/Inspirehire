import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import UserRegister from "./pages/UserRegister";
import Home from "./pages/Home";
import "./App.css"
import Login from "./pages/Login";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import HRDashboard from "./pages/HRDashboard";
import PrivateRoute from "./components/PrivateRoute";
import JobPost from "./pages/JobPost";
import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";
import JobApplicationForm from "./pages/ApplicationPage.js"
import ManageJobs from "./pages/ManageJobs";
import EditJob from "./pages/EditJob.js";
import ManageCategories from "./pages/ManageCategories";
import DeleteJob from "./pages/DeleteJob.js";
import CreateHR from "./pages/CreateHR.js";
import ChangePassword from "./pages/ChangePassword.js";

function App() {
  return (
    <Router>
    
      <Navbar className = "navbarCust" expand="lg" variant="dark">
        <Container>
        <Navbar.Brand as={Link} to="/">
            <img 
              src="/assets/logo.png"  // Use the image with text
              alt="InspireHire Logo"
              height="50"  // Adjust the height
              className="logo-text-image"
            />
            <img 
              src="/assets/logo-text.png"  // Use the image with text
              alt="InspireHire Logo"
              height="50"  // Adjust the height
              className="logo-text-image"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
              <LogoutButton />  
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Routes */}
      <Container className="mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<JobListings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/jobs/:id" element={<JobDetails />}/>
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Protected Routes (Only accessible if logged in) */}
          <Route element={<PrivateRoute allowedRoles={[1]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/manage-categories" element={<ManageCategories />} />
            <Route path="/delete-job" element={<DeleteJob />} />
            <Route path="/create-hr" element={<CreateHR />} />
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={[3]} />}>
            <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
            <Route path="/apply-job/:job_id" element={< JobApplicationForm />} />
          </Route>
          {/*HR only routes*/}
          <Route element={<PrivateRoute allowedRoles={[2]} />}>
            <Route path="/hr-dashboard" element={<HRDashboard />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={[2]} />}>
          <Route path="/post-job" element={<JobPost />} />
          </Route>
          <Route path="/manage-jobs" element={<ManageJobs />} />
          <Route path="/edit-job/:id" element={<EditJob />} />

          

        </Routes>
      </Container>
    </Router>
  );
}

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");    // Remove JWT Token
    localStorage.removeItem("userRole"); // Remove Role
    localStorage.removeItem("User_ID");  // Remove user id
    navigate("/login");                  // Redirect to Login
  };

  return (
    <Nav.Link onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
      Logout
    </Nav.Link>
  );
};

export default App;
