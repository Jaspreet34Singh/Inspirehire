import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Row, Col, Button, Table, Alert } from "react-bootstrap";

const ReportsPage = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [categoryReport, setCategoryReport] = useState([]);
  const [difficultyReport, setDifficultyReport] = useState([]);
  const [error, setError] = useState("");

  const handleGenerateReports = async () => {
    if (!year) {
      setError("Please select year.");
      return;
    }

    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch category summary
      const catRes = await axios.get(
        `http://localhost:3000/reports/applications-summary?month=${month}&year=${year}`,
        config
      );

      // Fetch difficulty report
      const diffRes = await axios.get(
        `http://localhost:3000/reports/qualified-candidates?month=${month}&year=${year}`,
        config
      );

      setCategoryReport(catRes.data.summary);
      setDifficultyReport(diffRes.data.report);
    } catch (err) {
      console.error("Error generating reports:", err);
      setError("Failed to generate reports.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>📊 Admin Reports</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filter Form */}
      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Label>Month</Form.Label>
            <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Select...</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Col>

          <Col md={3} className="d-flex align-items-end">
            <Button onClick={handleGenerateReports}>Generate Reports</Button>
          </Col>
        </Row>
      </Form>

      {/* Applications Summary */}
      {categoryReport.length > 0 && (
        <>
          <h4 className="mt-4">📁 Jobs & Applications by Category</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Category</th>
                <th># Jobs</th>
                <th># Applications</th>
              </tr>
            </thead>
            <tbody>
              {categoryReport.map((cat) => (
                <tr key={cat.Category_ID}>
                  <td>{cat.Category_Name}</td>
                  <td>{cat.jobCount}</td>
                  <td>{cat.applicationCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Qualified Difficulty Summary */}
      {difficultyReport.length > 0 && (
        <>
          <h4 className="mt-4">📌 Qualified Candidate Difficulty by Job</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Total Applicants</th>
                <th>Qualified Applicants</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {difficultyReport.map((job) => (
                <tr key={job.jobId}>
                  <td>{job.title}</td>
                  <td>{job.totalApplicants}</td>
                  <td>{job.qualifiedApplicants}</td>
                  <td>{job.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default ReportsPage;
