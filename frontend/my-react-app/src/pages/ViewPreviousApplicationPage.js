import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Spinner, Alert } from "react-bootstrap";

const ViewApplicantApplications = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/viewApplication/applications/user/${userId}`);
        setApplications(response.data);
      } catch (err) {
        setError("Failed to fetch applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Job Applications</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && applications.length === 0 && (
        <Alert variant="info">No applications found.</Alert>
      )}
      {!loading && !error && applications.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Job Title</th>
              <th>Job Type</th>
              <th>Location</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.Application_ID}>
                <td>{index + 1}</td>
                <td>{app.JobPost.Job_Title}</td>
                <td>{app.JobPost.Job_Type}</td>
                <td>{app.JobPost.Job_Location}</td>
                <td>${app.JobPost.Salary}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ViewApplicantApplications;
