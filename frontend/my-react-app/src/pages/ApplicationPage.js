import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import API from "../utils/axiosInstance.js"
import Swal from "sweetalert2"

const JobApplicationForm = () => {
    const user_Id = localStorage.getItem('User_ID'); // Fetch user ID from local storage
    const { job_id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        userId: user_Id || '',
        contact: '',
        EducationExp: '',
        FieldRelatedExp: 0,
        OffFieldExpTier: 0,
        OffFieldExp: 0,
        resume: null,
        coverLetter: null
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await API.get(`/apply/${user_Id}`);
                const userData = response.data.user; 
                console.log(response.data.user)

                setFormData(prevState => ({
                    ...prevState,
                    name: userData.Name || '',
                    email: userData.Email || '',
                    contact: userData.Phone || '',
                }));
            } catch (error) {
                console.error("Error fetching user info:", error);
                Swal.fire({
                    title: "Error",
                    text: "Could not fetch user information",
                    icon: "error"
                });
            }
        };

        if (user_Id) {
            fetchUserInfo();
        }
    }, [user_Id]);

    const validateForm = () => {
        const newErrors = {};

        // Validate Education
        if (!formData.EducationExp) {
            newErrors.EducationExp = "Education level is required";
        }

        // Validate Resume
        if (!formData.resume) {
            newErrors.resume = "Resume is required";
        } else {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(formData.resume.type)) {
                newErrors.resume = "Invalid file type. Please upload PDF or DOC/DOCX";
            }
            if (formData.resume.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.resume = "Resume file size should be less than 5MB";
            }
        }

        // Validate Cover Letter
        if (!formData.coverLetter) {
            newErrors.coverLetter = "Cover Letter is required";
        } else {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(formData.coverLetter.type)) {
                newErrors.coverLetter = "Invalid file type. Please upload PDF or DOC/DOCX";
            }
            if (formData.coverLetter.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.coverLetter = "Cover letter file size should be less than 5MB";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value === '' ? 0 : value
        }));

        // Clear the specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: files[0]
        }));

        // Clear the specific error when a file is selected
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before submission
        if (!validateForm()) {
            Swal.fire({
                title: "Validation Error",
                text: "Please correct the errors in the form",
                icon: "error"
            });
            return;
        }

        const applicationData = new FormData();

        // Calculate total off-field score (using 0 as default if not selected)
        const totalOffFieldScore = (Number(formData.OffFieldExp) * Number(formData.OffFieldExpTier));
        
        // Explicitly append all fields
        applicationData.append('name', formData.name);
        applicationData.append('email', formData.email);
        applicationData.append('userId', formData.userId);
        applicationData.append('contact', formData.contact);
        applicationData.append('EducationExp', formData.EducationExp);
        applicationData.append('FieldRelatedExp', formData.FieldRelatedExp || 0);
        applicationData.append('OffFieldExp', totalOffFieldScore);
        
        // Append files with specific handling
        if (formData.resume) {
            applicationData.append('resume', formData.resume);
        }
        if (formData.coverLetter) {
            applicationData.append('coverLetter', formData.coverLetter);
        }

        // Append additional job-related information
        applicationData.append('Job_ID', job_id);
        applicationData.append('Applied_Date', new Date().toISOString().split('T')[0]);
        applicationData.append('ScreeningDetails', 'Initial Application');

        try {
            const response = await API.post('/apply/submit', applicationData, {
                headers: { 
                    'Content-Type': 'multipart/form-data' 
                }
            });

            Swal.fire({
                title: "Success!",
                text: `Application Successfully submitted!`,
                icon: "success",
                confirmButtonText: "OK"
            });
        } catch (err) {
            console.error("Application submission error:", err);
            
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Error submitting application. Please try again.",
                icon: "error"
            });
        }
    };


    return (
        <Container className="mt-5">
            <h2 className="mb-4">Job Application</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                readOnly 
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="userId"
                                value={formData.userId}
                                readOnly
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                readOnly
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Contact</Form.Label>
                            <Form.Control 
                                type="tel" 
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                readOnly 
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Education</Form.Label>
                            <select 
                                className={`form-select ${errors.EducationExp ? 'is-invalid' : ''}`}
                                name="EducationExp"
                                value={formData.EducationExp}
                                onChange={handleInputChange}
                                aria-label="Education level select"
                                required
                            >
                                <option value="">Select Education Level</option>
                                <option value="Masters">Masters</option>
                                <option value="Bachelors">Bachelors</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Certificate">Certificate</option>
                            </select>
                            {errors.EducationExp && (
                                <div className="invalid-feedback">{errors.EducationExp}</div>
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Field Work Experience (Years)</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="FieldRelatedExp"
                                value={formData.FieldRelatedExp}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Off Field Work experience</Form.Label>
                            <select 
                                className="form-select" 
                                aria-label="Off field work experience select"
                                name="OffFieldExpTier"
                                value={formData.OffFieldExpTier}
                                onChange={handleInputChange}
                            >
                                <option value="0">Select Experience Tier</option>
                                <option value="200">TEER 0</option>
                                <option value="100">TEER 1 </option>
                                <option value="75">TEER 2 </option>
                                <option value="50">TEER 3 or more</option>
                            </select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Label>Number of years (Off Field)</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="OffFieldExp"
                            value={formData.OffFieldExp}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Resume</Form.Label>
                            <Form.Control 
                                type="file" 
                                name="resume"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className={errors.resume ? 'is-invalid' : ''}
                                required 
                            />
                            {errors.resume && (
                                <div className="invalid-feedback">{errors.resume}</div>
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cover Letter</Form.Label>
                            <Form.Control 
                                type="file" 
                                name="coverLetter"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className={errors.coverLetter ? 'is-invalid' : ''}
                                required 
                            />
                            {errors.coverLetter && (
                                <div className="invalid-feedback">{errors.coverLetter}</div>
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                    Submit Application
                </Button>
            </Form>
        </Container>
    );
};

export default JobApplicationForm;