import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const JobPost = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Store job categories
  const [errors, setErrors] = useState("");
  const [jobData, setJobData] = useState({
    title: "",
    category: "",
    jobType: "",
    location: "",
    minEduReq: "",
    minWorkExp: "",
    salary: "",
    description: "",
    deadline: "",
  });

  // Fetch Job Categories from Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/jobs/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  // Validate Form
  const validateForm = () => {
    if (!jobData.title || !jobData.category || !jobData.jobType || !jobData.location || 
        !jobData.minEduReq || !jobData.minWorkExp || !jobData.salary || !jobData.description || !jobData.deadline) {
      return "All fields are required!";
    }

    if (isNaN(jobData.salary) || jobData.salary <= 0) {
      return "Salary must be a positive number!";
    }

    if (new Date(jobData.deadline) <= new Date()) {
      return "Deadline must be a future date!";
    }

    return null; // No errors
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrors(validationError);
      return;
    }

     // Debugging: Check what data is being sent
  console.log("Submitting job with data:", { 
    ...jobData, 
    category: parseInt(jobData.category) // Ensure category ID is an integer
  });

    try {
        await axios.post("http://localhost:3000/jobs/create", {
            ...jobData,
            category: parseInt(jobData.category),  // Convert category to an integer (ID)
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });

      alert("Job Posted Successfully!");
      navigate("/hr-dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      setErrors("Failed to post job. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Post a Job</h2>

      {/* Display Errors */}
      {errors && <Alert variant="danger">{errors}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Job Title</Form.Label>
          <Form.Control type="text" name="title" required onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Category</Form.Label>
          <Form.Select name="category" required onChange={handleChange}>
            <option value="">Select...</option>
            {categories.map((cat) => (
              <option key={cat.Category_ID} value={cat.Category_ID}>
                {cat.Category_Name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Type</Form.Label>
          <Form.Select name="jobType" required onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" required onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Minimum Education Requirement</Form.Label>
          <Form.Control type="text" name="minEduReq" required onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Minimum Work Experience</Form.Label>
          <Form.Control type="text" name="minWorkExp" required onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Salary</Form.Label>
          <Form.Control type="number" name="salary" required onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Description</Form.Label>
          <Form.Control as="textarea" name="description" required rows={4} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Application Deadline</Form.Label>
          <Form.Control type="date" name="deadline" required onChange={handleChange} />
        </Form.Group>

        <Button type="submit" variant="primary">Post Job</Button>
      </Form>
    </Container>
  );
};

export default JobPost;
