import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const HRProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("User_ID");

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/applicantProfile/${userId}`);
        setUserData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching HR data:', err);
        setLoading(false);
      }
    };

    fetchHRData();
  }, [userId]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="py-5">
        <Alert variant="danger">HR user not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="pb-5">
      <Row>
        <Col>
          <div className="profile-header text-center mb-4 py-5 rounded-bottom shadow-sm bg-primary text-white">
            <div className="avatar-container mx-auto mb-3">
              <img
                src={userData.Image || '/default-avatar.png'}
                alt="Profile"
                className="rounded-circle border border-3 border-white shadow"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
            </div>
            <h1 className="fw-bold">{userData.Name}</h1>
            <p className="text-light">User ID: {userData.User_ID}</p>
            <Button
              variant="light"
              className="rounded-pill px-4 mt-2"
              onClick={() => navigate(`/hr-modify/${userData.User_ID}`)}
            >
              Modify Profile
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Personal Information</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={4} className="fw-bold text-secondary">Email:</Col>
                <Col md={8}>{userData.Email}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold text-secondary">Phone:</Col>
                <Col md={8}>{userData.phone}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold text-secondary">Date of Birth:</Col>
                <Col md={8}>{formatDate(userData.DateOfBirth)}</Col>
              </Row>
              <Row>
                <Col md={4} className="fw-bold text-secondary">Working ID:</Col>
                <Col md={8}>{userData.WorkingID || 'Not Assigned'}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HRProfile;
