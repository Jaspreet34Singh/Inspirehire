import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ApplicantProfile.css'; 
import { useNavigate } from 'react-router-dom';


const ApplicantProfile = () => {
    const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [educationData, setEducationData] = useState([]);
  const [preferenceData, setPreferenceData] = useState([]);
  const [workExpData, setWorkExpData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const userId = localStorage.getItem("User_ID")
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:3000/applicantProfile/${userId}`);
        setUserData(userResponse.data);
        
        // Fetch education data
        const educationResponse = await axios.get(`http://localhost:3000/applicantProfile/${userId}/education`);
        setEducationData(educationResponse.data);
        
        // Fetch work experience data
        const workExpResponse = await axios.get(`http://localhost:3000/applicantProfile/${userId}/workexp`);
        setWorkExpData(workExpResponse.data);
        
        // Fetch job preferences with category names
        const preferenceResponse = await axios.get(`http://localhost:3000/applicantProfile/${userId}/preferences`);
        setPreferenceData(preferenceResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="py-5">
        <Alert variant="danger">User not found</Alert>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Container className="pb-5">
      {/* Header Section with Gradient Background */}
      <Row>
        <Col>
          <div className="profile-header text-center mb-4 py-5 rounded-bottom shadow-sm">
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
                variant="outline-light" 
                className="rounded-pill px-4"
                onClick={() => navigate(`/applicant-modify/${userData.User_ID}`)}
                >
                Modify Profile
            </Button>
          </div>
        </Col>
      </Row>

      {/* Personal Information Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Personal Information</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={3} className="fw-bold text-secondary">Email:</Col>
                <Col md={9}>{userData.Email}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={3} className="fw-bold text-secondary">Phone:</Col>
                <Col md={9}>{userData.phone}</Col>
              </Row>
              <Row>
                <Col md={3} className="fw-bold text-secondary">Date of Birth:</Col>
                <Col md={9}>{formatDate(userData.DateOfBirth)}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Education Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Education</h5>
            </Card.Header>
            <Card.Body>
              {educationData.length > 0 ? (
                educationData.map((edu, index) => (
                  <div key={edu.EduDetail_ID} className={index !== 0 ? "pt-3 mt-3 border-top" : ""}>
                    <h5 className="mb-1">{edu.Degree}</h5>
                    <h6 className="fst-italic mb-1">{edu.InstitutionName}</h6>
                    <p className="text-muted mb-1">
                      <small>{edu.Field_Of_Study}</small>
                    </p>
                    <Badge bg="light" text="dark" className="px-2 py-1">
                      {formatDate(edu.Start_Date)} - {formatDate(edu.End_Date)}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted fst-italic">No education information available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Preferences Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Preferences</h5>
            </Card.Header>
            <Card.Body>
              {preferenceData.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {preferenceData.map((pref) => (
                    <Col key={pref.JobPref_ID}>
                      <Card className="h-100 bg-light">
                        <Card.Body>
                          <Card.Title className="h6">{pref.categoryName}</Card.Title>
                          </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted fst-italic">No preferences available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Work Experience Section */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Work Experience</h5>
            </Card.Header>
            <Card.Body>
              {workExpData.length > 0 ? (
                workExpData.map((work, index) => (
                  <div key={work.WorkExp_ID} className={index !== 0 ? "pt-4 mt-4 border-top" : ""}>
                    <h5 className="mb-1">{work.Job_Title}</h5>
                    <h6 className="fst-italic mb-2">
                      {work.CompanyName}
                    </h6>
                    <Badge bg="light" text="dark" className="px-2 py-1 mb-3">
                      {formatDate(work.StartDate)} - {formatDate(work.EndDate)}
                    </Badge>
                    <p className="mb-0">{work.JobDescription}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted fst-italic">No work experience available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicantProfile;