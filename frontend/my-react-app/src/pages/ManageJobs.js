import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/jobs/hr", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Error fetching HR jobs:", err);
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:3000/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(jobs.filter((job) => job.JOB_ID !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Manage Your Job Posts</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No jobs found</td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.JOB_ID}>
                <td>{job.Job_Title}</td>
                <td>{job.Job_Type}</td>
                <td>{job.Job_Location}</td>
                <td>${job.Salary}</td>
                <td>{job.Job_Deadline}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                   onClick={() => navigate(`/edit-job/${job.JOB_ID}`)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                 
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageJobs;
