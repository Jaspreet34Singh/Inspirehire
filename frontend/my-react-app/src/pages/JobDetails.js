import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/axiosInstance";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await API.get(`/jobs/${id}`);
        setJob(response.data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container className="mt-5 text-center">
        <h3>Job not found</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center fw-bold">{job.Job_Title}</h2>

      <div className="p-4 bg-light rounded">
        {/* Job Title and Metadata */}
        <h4 className="fw-bold">Job Title</h4>
        <Row className="text-secondary">
          <Col md={4}><strong>Location</strong></Col>
          <Col md={4}><strong>Deadline</strong></Col>
          <Col md={4}><strong>Job Type</strong></Col>
          <Col md={4}>{job.Job_Location}</Col>
          <Col md={4}>{new Date(job.Job_Deadline).toDateString()}</Col>
          <Col md={4}>{job.Job_Type}</Col>
          <Col md={4}><strong>Salary</strong></Col>
          <Col md={4}><strong>Posted On</strong></Col>
          <Col md={4}><strong>Category</strong></Col>
          <Col md={4}>${job.Salary}</Col>
          <Col md={4}>{new Date(job.Posted_On).toDateString()}</Col>
          <Col md={4}>{job.Category_ID}</Col>
        </Row>

        {/* Apply Now Button */}
        <div className="text-end mt-3">
          <Button variant="primary">Apply Now</Button>
        </div>

        {/* Job Description */}
        <h4 className="fw-bold mt-4">Description</h4>
        <p className="text-secondary">{job.Job_Description}</p>
      </div>
    </Container>
  );
};

export default JobDetails;
