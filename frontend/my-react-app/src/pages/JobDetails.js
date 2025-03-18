import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/axiosInstance";
import { Container, Spinner } from "react-bootstrap";

const JobDetails = () => {
  const { id } = useParams(); // Get Job ID from URL
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
    return <Spinner animation="border" />;
  }

  if (!job) {
    return <Container><h3>Job not found</h3></Container>;
  }

  return (
    <Container className="mt-4">
      <h2>{job.Job_Title}</h2>
      <p><strong>Category:</strong> {job.Category_ID}</p>
      <p><strong>Type:</strong> {job.Job_Type}</p>
      <p><strong>Location:</strong> {job.Job_Location}</p>
      <p><strong>Minimum Education:</strong> {job.Min_EduReq}</p>
      <p><strong>Work Experience:</strong> {job.Min_WorkExp}</p>
      <p><strong>Salary:</strong> ${job.Salary}</p>
      <p><strong>Description:</strong> {job.Job_Description}</p>
      <p><strong>Deadline:</strong> {new Date(job.Job_Deadline).toDateString()}</p>
    </Container>
  );
};

export default JobDetails;
