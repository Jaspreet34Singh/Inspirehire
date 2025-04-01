import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";

const DeleteJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await axios.delete(`http://localhost:3000/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
      <h2>Delete Job Postings</h2>
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
              <td colSpan="6" className="text-center">No job postings available.</td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.JOB_ID}>
                <td>{job.Job_Title}</td>
                <td>{job.Job_Type}</td>
                <td>{job.Job_Location}</td>
                <td>${job.Salary}</td>
                <td>{job.Job_Deadline?.split("T")[0]}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(job.JOB_ID)}>
                    Delete
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

export default DeleteJob;
