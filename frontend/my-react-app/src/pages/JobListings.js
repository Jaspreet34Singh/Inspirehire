import React, { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(""); // Search filter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get("/jobs");
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Job Listings</h2>

      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search by title or location..."
        className="mb-3"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <Row>
        {jobs
          .filter((job) =>
            job.Job_Title.toLowerCase().includes(search) || job.Job_Location.toLowerCase().includes(search)
          )
          .map((job) => (
            <Col key={job.JOB_ID} md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{job.Job_Title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{job.JobCategory?.Category_Name}</Card.Subtitle>
                  <Card.Text>
                    <strong>Location:</strong> {job.Job_Location} <br />
                    <strong>Salary:</strong> ${job.Salary}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/jobs/${job.JOB_ID}`)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default JobListings;
