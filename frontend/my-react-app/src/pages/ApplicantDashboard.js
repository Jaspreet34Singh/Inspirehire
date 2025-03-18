import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const ApplicantDashboard = () => {
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Applicant Dashboard</h2>
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>View Job Listings</Card.Title>
              <Card.Text>Explore job openings and find the perfect fit.</Card.Text>
              <Button as={Link} to="/jobs" variant="primary">
                Browse Jobs
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>My Applications</Card.Title>
              <Card.Text>Track your applied jobs and their status.</Card.Text>
              <Button as={Link} to="/applications" variant="secondary">
                View Applications
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Modify Profile</Card.Title>
              <Card.Text>Update your personal details and resume.</Card.Text>
              <Button as={Link} to="/edit-profile" variant="warning">
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicantDashboard;
