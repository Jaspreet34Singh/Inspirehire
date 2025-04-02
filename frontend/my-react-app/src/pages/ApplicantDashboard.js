import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faClipboardList, faUserPen } from '@fortawesome/free-solid-svg-icons';


const ApplicantDashboard = () => {
  const userId = localStorage.getItem("User_ID")
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">Your Dashboard</h1>
          <p className="text-muted">Welcome back! Here's an overview of your job search journey.</p>
        </Col>
      </Row>
      

      {/* Main action cards */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm hover-shadow transition">
            <Card.Body className="d-flex flex-column p-4">
              <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle p-4 mb-3 align-self-start">
              <FontAwesomeIcon icon={faBriefcase} />
              </div>
              <Card.Title className="fs-4 fw-bold">Explore Opportunities</Card.Title>
              <Card.Text className="text-muted mb-4">
                Discover new job openings tailored to your skills and preferences.
              </Card.Text>
              <Button 
                as={Link} 
                to="/" 
                variant="outline-primary" 
                className="mt-auto w-100 py-2 fw-semibold"
              >
                Browse Jobs
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm hover-shadow transition">
            <Card.Body className="d-flex flex-column p-4">
              <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle p-4 mb-3 align-self-start">
              <FontAwesomeIcon icon={faClipboardList} />
              </div>
              <Card.Title className="fs-4 fw-bold">My Applications</Card.Title>
              <Card.Text className="text-muted mb-4">
                Track your applications and stay updated on their progress.
              </Card.Text>
              <Button 
                as={Link} 
                to={`/applicant-PreviousApplications/${userId}`}
                variant="outline-success" 
                className="mt-auto w-100 py-2 fw-semibold"
              >
                View Applications
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm hover-shadow transition">
            <Card.Body className="d-flex flex-column p-4">
              <div className="icon-wrapper bg-warning bg-opacity-10 rounded-circle p-4 mb-3 align-self-start">
              <FontAwesomeIcon icon={faUserPen} />
              </div>
              <Card.Title className="fs-4 fw-bold">My Profile</Card.Title>
              <Card.Text className="text-muted mb-4">
               View and Update your information, skills, and preferences to attract better matches.
              </Card.Text>
              <Button 
                as={Link} 
                to="/applicant-profile" 
                variant="outline-warning" 
                className="mt-auto w-100 py-2 fw-semibold"
              >
                View Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      

      {/* Custom CSS for hover effects */}
      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </Container>
  );
};

export default ApplicantDashboard;