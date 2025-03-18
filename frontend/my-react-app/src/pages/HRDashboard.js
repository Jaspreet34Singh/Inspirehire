import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../styles/Dashboard.css"; // Assuming shared styles for dashboards

const HRDashboard = () => {
  return (
    <Container className="dashboard-container">
      {/* Title */}
      <h2 className="text-center">HR Dashboard</h2>

      {/* Dashboard Options */}
      <Row className="mt-4 justify-content-center">
        <Col md={4} className="mb-3">
          <Button variant="primary" className="w-100" href="/post-job">
            Post a Job
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button variant="secondary" className="w-100" href="/manage-jobs">
            Manage Jobs
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button variant="warning" className="w-100" href="/modify-account">
            Modify Account
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HRDashboard;
