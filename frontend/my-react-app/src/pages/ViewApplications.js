import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Collapse,
  Button
} from "react-bootstrap";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const baseUrl = "http://localhost:3000";

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/view-applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setApplications(res.data.applications);
      setFilteredApplications(res.data.applications);
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

  // Filter logic
  useEffect(() => {
    const filtered = applications.filter((app) => {
      const matchesName = app.User?.Name?.toLowerCase().includes(searchName.toLowerCase());
      const matchesDate = !filterDate || app.JobPost?.Job_Deadline === filterDate;
      const matchesCategory = !filterCategory || app.JobPost?.JobCategory?.Category_Name?.toLowerCase().includes(filterCategory.toLowerCase());
      return matchesName && matchesDate && matchesCategory;
    });

    setFilteredApplications(filtered);
  }, [searchName, filterDate, filterCategory, applications]);

  // Format the file URL to ensure it has the correct base URL
  const getFileUrl = (path) => {
    if (!path) return null;
    
    // If the path already includes http/https, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // If path starts with a slash, make sure we don't double up
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${formattedPath}`;
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Applications for Your Posted Jobs</h2>

      <Form className="mb-4">
        <Row className="align-items-center">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by Applicant Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button
              variant="outline-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Col>
        </Row>

        <Collapse in={showFilters}>
          <div className="mt-3">
            <Row className="g-3">
              <Col md={3}>
                <Form.Label>Application Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </Col>

              <Col md={4}>
                <Form.Label>Job Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. IT, Marketing"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                />
              </Col>
            </Row>
          </div>
        </Collapse>
      </Form>

      {filteredApplications.length === 0 ? (
        <Alert variant="warning">No applications match your search or filters.</Alert>
      ) : (
        <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Job Category</th>
            <th>Deadline</th>
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
          {filteredApplications.map((app) => (
            <tr key={app.Application_ID}>
              <td>{app.JobPost?.Job_Title}</td>
              <td>{app.JobPost?.JobCategory?.Category_Name || "N/A"}</td>
              <td>{app.JobPost?.Job_Deadline || "N/A"}</td>
              <td>{app.User?.Name}</td>
              <td>{app.User?.Email}</td>
              <td>{app.User?.Phone}</td>
              <td>{app.FieldRelatedExp} yrs</td>
              <td>{app.EducationExp}</td>
              <td>
              {app.Resume ? (
                    <a 
                      href={getFileUrl(app.Resume)} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={(e) => {
                        if (!app.Resume.startsWith('http')) {
                          e.preventDefault();
                          window.open(getFileUrl(app.Resume), '_blank');
                        }
                      }}
                    >
                      View
                    </a>
                  ) : "No Resume"}

              </td>
              <td>
              {app.CoverLetter ? (
                    <a 
                      href={getFileUrl(app.CoverLetter)} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={(e) => {
                        if (!app.CoverLetter.startsWith('http')) {
                          e.preventDefault();
                          window.open(getFileUrl(app.CoverLetter), '_blank');
                        }
                      }}
                    >
                      View
                    </a>
                  ) : "No Cover"}

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
