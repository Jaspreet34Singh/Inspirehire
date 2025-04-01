import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";

const EditJob = () => {
    console.log("🛠️ EditJob component rendered");
  const { id } = useParams(); // Job ID from the URL
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [jobData, setJobData] = useState({
    title: "",
    category: "",
    jobType: "",
    location: "",
    MinEducationLevel: "",
    MinFieldRelatedExp: "",
    salary: "",
    description: "",
    deadline: "",
  });

  const [errors, setErrors] = useState("");

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:3000/jobs/categories")
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/jobs/${id}`);
        console.log("Fetched job:", res.data.job);  // 🔍 Debug line
        const job = res.data.job;
  
        setJobData({
          title: job.Job_Title,
          category: job.Category_ID,
          jobType: job.Job_Type,
          location: job.Job_Location,
          MinEducationLevel: job.MinEducationLevel,
          MinFieldRelatedExp: job.MinFieldRelatedExp,
          salary: job.Salary,
          description: job.Job_Description,
          deadline: job.Job_Deadline.split("T")[0],
        });
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };
  
    fetchJob();
  }, [id]);
  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !jobData.title ||
      !jobData.category ||
      !jobData.jobType ||
      !jobData.location ||
      !jobData.MinEducationLevel ||
      !jobData.MinFieldRelatedExp ||
      !jobData.salary ||
      !jobData.description ||
      !jobData.deadline
    ) {
      return "All fields are required!";
    }

    if (isNaN(jobData.salary) || jobData.salary <= 0) {
      return "Salary must be a positive number!";
    }

    if (new Date(jobData.deadline) <= new Date()) {
      return "Deadline must be a future date!";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    console.log("🔁 Form submission triggered");
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrors(validationError);
      return;
    }

    try {
        console.log("📤 Sending updated job data:", {
            ...jobData,
            category: parseInt(jobData.category),
          });
      await axios.put(
        `http://localhost:3000/jobs/edit/${id}`,
        {
          ...jobData,
          category: parseInt(jobData.category),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Job updated successfully!");
      navigate("/hr-dashboard");
    } catch (error) {
      console.error("Error updating job:", error);
      setErrors("Failed to update job.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Edit Job</h2>
      {errors && <Alert variant="danger">{errors}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Job Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Category</Form.Label>
          <Form.Select
            name="category"
            value={jobData.category}
            onChange={handleChange}
          >
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
          <Form.Select
            name="jobType"
            value={jobData.jobType}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Minimum Education Level</Form.Label>
          <Form.Select
            name="MinEducationLevel"
            value={jobData.MinEducationLevel}
            onChange={handleChange}
          >
            <option value="">Select Education Level</option>
            <option value="Masters">Masters</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Diploma">Diploma</option>
            <option value="Certificate">Certificate</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Minimum Field-Related Experience</Form.Label>
          <Form.Control
            type="text"
            name="MinFieldRelatedExp"
            value={jobData.MinFieldRelatedExp}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type="number"
            name="salary"
            value={jobData.salary}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={jobData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Application Deadline</Form.Label>
          <Form.Control
            type="date"
            name="deadline"
            value={jobData.deadline}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditJob;
