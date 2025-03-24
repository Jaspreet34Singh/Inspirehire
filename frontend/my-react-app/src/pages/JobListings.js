import React, { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import { Container, Card, Button, Row, Col, Form, Collapse, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import "../styles/JobListing.css"


const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(""); 
  const [showFilters, setShowFilters] = useState(false);
  
  // Additional filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterSalary, setFilterSalary] = useState("");

  const navigate = useNavigate();

  const checkSalaryRange = (salary, range) => {
    if (!range) return true; // If no range selected, return true
    
    const [min, max] = range.split('-').map(Number);
    
    // Handle the last option which might not have an upper bound
    if (max) {
      return salary >= min && salary <= max;
    } else {
      return salary >= min;
    }
  };



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

  // Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.Job_Title.toLowerCase().includes(search.toLowerCase()) || 
      job.Job_Location.toLowerCase().includes(search.toLowerCase());
    
    const matchesDate = !filterDate || job.Job_Deadline === filterDate;
    const matchesCategory = !filterCategory || job.JobCategory.Category_Name.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesLocation = !filterLocation || job.Job_Location.toLowerCase().includes(filterLocation.toLowerCase());
    
    const matchesSalary = !filterSalary || checkSalaryRange(job.Salary, filterSalary);

    return matchesSearch && matchesDate && matchesCategory && matchesLocation && matchesSalary;
  });

  const isFilterActive = filterDate || filterCategory || filterLocation || filterSalary || search;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Search for Jobs</h2>

      {/* Search Bar with Filter Toggle */}
      <div className="outerBoxSearchBar">
        <div className="position-relative mb-3">
          <Form.Control
            type="text"
            placeholder="Search for jobs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pe-5"
          />
          <Button 
            variant="light" 
            className="position-absolute top-0 end-0 mt-1 me-1 CustomBtn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <img className="img-Filter" src= "/assets/filter.png" alt= "Filter"></img>
          </Button>
        </div>
      

      {/* Collapsible Filters */}
        <Collapse in={showFilters}>
          <div>
            <Row className="g-3 mb-4 bg- p-3 rounded">
              <Col md={3}>
                <Form.Control 
                  type="date" 
                  placeholder="Application Due Date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control 
                  type="text" 
                  placeholder="Job Category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control 
                  type="text" 
                  placeholder="Location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Select 
                  value={filterSalary}
                  onChange={(e) => setFilterSalary(e.target.value)}
                >
                  <option value="">Select Salary Range</option>
                  <option value="0-50000">$0 - $50,000</option>
                  <option value="50000-100000">$50,000 - $100,000</option>
                  <option value="100000-150000">$100,000 - $150,000</option>
                  <option value="150000-200000">$150,000 - $200,000</option>
                </Form.Select>
              </Col>
            </Row>
          </div>
        </Collapse>
      </div>



      {isFilterActive && filteredJobs.length === 0 && (
        <Alert variant="warning" className="d-flex align-items-center">
          <search className="me-2" />
          <span>
            No jobs found matching your search criteria. 
            Try adjusting your filters or search terms.
          </span>
        </Alert>
      )}


      {/* Job Listings */}
      <Row>
        {filteredJobs.map((job) => (
          <Col md={12} key={job.id} className="mb-3">
            <Card className="shadow-sm border-0" style={{ backgroundColor: "#f8fdff", borderRadius: "12px" }}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <h5 className="fw-bold">{job.Job_Title}</h5>
                    <p className="text-muted mb-1">
                      <strong>Location:</strong> {job.Job_Location} | <strong>Salary:</strong> ${job.Salary}
                    </p>
                    <p className="text-muted mb-0">
                      <strong>Deadline:</strong> {job.Job_Deadline} | <strong>Posted On:</strong> {job.Posted_Date}
                    </p>
                    <p className="text-muted mb-0">
                      <strong>Job Type:</strong> {job.Job_Type} | <strong>Category:</strong> {job.JobCategory.Category_Name}
                    </p>
                  </Col>
                  <Col md={4} className="text-end">
                    <Link to={`/jobs/${job.JOB_ID}`}>
                      <Button 
                        variant="primary" 
                        style={{ 
                          backgroundColor: "#7b61ff", 
                          borderRadius: "25px", 
                          padding: "10px 20px" 
                        }}
                      >
                        View Job
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default JobListings; 