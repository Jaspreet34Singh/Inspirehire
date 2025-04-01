import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Spinner, Alert } from "react-bootstrap";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/view-applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Applications for Your Posted Jobs</h2>
      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Field Experience</th>
              <th>Education</th>
              <th>Resume</th>
              <th>Cover Letter</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.Application_ID}>
                <td>{app.JobPost?.Job_Title}</td>
                <td>{app.User?.Name}</td>
                <td>{app.User?.Email}</td>
                <td>{app.User?.Phone}</td>
                <td>{app.FieldRelatedExp} yrs</td>
                <td>{app.EducationExp}</td>
                <td>
                   {app.Resume_Link ? (
                    <a href={app.Resume_Link} target="_blank" rel="noreferrer">View Resume</a>
                     ) : "No Resume"}
                </td>
                <td>
                {app.CoverLetter_Link ? (
                <a href={app.CoverLetter_Link} target="_blank" rel="noreferrer">View Cover Letter</a>
                ) : "No Cover Letter"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ViewApplications;
