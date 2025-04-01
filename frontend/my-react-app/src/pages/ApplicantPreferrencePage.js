import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import "../styles/ApplicationPreferrence.css"

const ApplicantPreferences = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('User_ID'); // localstorage

  useEffect(() => {
    // Fetch job categories from the database
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/jobs/categories');
        console.log(response.data)
        setCategories(response.data.categories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job categories:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load job categories',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Validation schema for the form
  const validationSchema = Yup.object({
    education: Yup.object({
      degree: Yup.string().required('Degree is required'),
      institute: Yup.string().required('Institute name is required'),
      fieldOfStudy: Yup.string().required('Field of study is required'),
      startDate: Yup.date().required('Start date is required')
    }),
    jobPreferences: Yup.array().of(
      Yup.number().required('At least one job category must be selected')
    ).min(1, 'Please select at least one job category'),
    workExperience: Yup.array().of(
      Yup.object({
        jobTitle: Yup.string().required('Job title is required'),
        companyName: Yup.string().required('Company name is required'),
        jobDescription: Yup.string().required('Job description is required'),
        startDate: Yup.date().required('Start date is required')
      })
    )
  });

  // Initial values for the form
  const initialValues = {
    education: {
      degree: '',
      institute: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: null
    },
    jobPreferences: [],
    workExperience: [
      {
        jobTitle: '',
        companyName: '',
        jobDescription: '',
        startDate: '',
        endDate: null
      }
    ]
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {

        console.log(values)
        console.log(userId)
      // Save education details
      await axios.post('http://localhost:3000/preferrence/education', {
        USER_ID: userId,
        Degree: values.education.degree,
        Start_Date: values.education.startDate,
        End_Date: values.education.endDate === "" ? null : values.education.endDate,
        InstitutionName: values.education.institute,
        Field_Of_Study: values.education.fieldOfStudy
      });
      
      // Save job preferences
      for (const categoryId of values.jobPreferences) {
        await axios.post('http://localhost:3000/preferrence/job-preferences', {
          USER_ID: userId,
          Category_ID: categoryId,
          JobType: 'Full-time', // Default value, modify as needed
          JobLocation: 'Remote' // Default value, modify as needed
        });
      }
      
      // Save work experience
      
        await axios.post('http://localhost:3000/preferrence/work-experience', {
          USER_ID: userId,
          workExperience: values.workExperience 
        });
      
      
      // Update user's firstLogin status
      await axios.put(`http://localhost:3000/preferrence/users/${userId}/update-first-login`, {
        First_Login: false
      });
      
      Swal.fire({
        title: 'Success!',
        text: 'Your preferences have been saved!',
        icon: 'success',
        confirmButtonText: 'Continue to Dashboard'
      }).then(() => {
        // Redirect to applicant dashboard
        navigate('/applicant-dashboard');
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to save preferences',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header customColor text-white">
              <h3 className="mb-0">Complete Your Profile</h3>
            </div>
            <div className="card-body">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form>
                    {/* Education Section */}
                    <div className="mb-4">
                      <h4 className="mb-3">Highest Level of Education</h4>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Degree</label>
                          <Field type="text" className="form-control" name="education.degree" />
                          <ErrorMessage name="education.degree" component="div" className="text-danger" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Start Date</label>
                          <Field type="date" className="form-control" name="education.startDate" />
                          <ErrorMessage name="education.startDate" component="div" className="text-danger" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Name of Institute</label>
                          <Field type="text" className="form-control" name="education.institute" />
                          <ErrorMessage name="education.institute" component="div" className="text-danger" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">End Date</label>
                          <Field type="date" className="form-control" name="education.endDate" />
                          <ErrorMessage name="education.endDate" component="div" className="text-danger" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Field Of Study</label>
                          <Field type="text" className="form-control" name="education.fieldOfStudy" />
                          <ErrorMessage name="education.fieldOfStudy" component="div" className="text-danger" />
                        </div>
                      </div>
                    </div>

                    {/* Job Categories Section */}
                    <div className="mb-4">
                      <h4 className="mb-3">Preferred Job Categories</h4>
                      <div className="d-flex flex-wrap gap-2">
                        {categories.map(category => (
                          <div key={category.Category_ID} className="form-check">
                            <input
                              type="checkbox"
                              className="btn-check"
                              id={`category-${category.Category_ID}`}
                              checked={values.jobPreferences.includes(category.Category_ID)}
                              onChange={() => {
                                const currentPreferences = [...values.jobPreferences];
                                const index = currentPreferences.indexOf(category.Category_ID);
                                
                                if (index === -1) {
                                  currentPreferences.push(category.Category_ID);
                                } else {
                                  currentPreferences.splice(index, 1);
                                }
                                
                                setFieldValue('jobPreferences', currentPreferences);
                              }}
                            />
                            <label
                              className={`btn ${values.jobPreferences.includes(category.Category_ID) 
                                ? 'btn-primary' 
                                : 'btn-outline-primary'}`}
                              htmlFor={`category-${category.Category_ID}`}
                              style={{ 
                                'padding-left': '25px',
                                'padding-right': '25px',
                                borderRadius: '25px',
                                background: values.jobPreferences.includes(category.Category_ID) 
                                  ? 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)' 
                                  : 'white'
                              }}
                            >
                              {category.Category_Name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <ErrorMessage name="jobPreferences" component="div" className="text-danger mt-2" />
                    </div>

                    {/* Work Experience Section */}
                    <div className="mb-4">
                      <h4 className="mb-3">Work Experience (Max 2)</h4>
                      <FieldArray name="workExperience">
                        {({ remove, push }) => (
                          <>
                            {values.workExperience.map((_, index) => (
                              <div key={index} className="card mb-3 p-3 border-light">
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">Job Title</label>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name={`workExperience.${index}.jobTitle`}
                                    />
                                    <ErrorMessage
                                      name={`workExperience.${index}.jobTitle`}
                                      component="div"
                                      className="text-danger"
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">Start Date</label>
                                    <Field
                                      type="date"
                                      className="form-control"
                                      name={`workExperience.${index}.startDate`}
                                    />
                                    <ErrorMessage
                                      name={`workExperience.${index}.startDate`}
                                      component="div"
                                      className="text-danger"
                                    />
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">Job Description</label>
                                    <Field
                                      as="textarea"
                                      className="form-control"
                                      name={`workExperience.${index}.jobDescription`}
                                      rows="2"
                                    />
                                    <ErrorMessage
                                      name={`workExperience.${index}.jobDescription`}
                                      component="div"
                                      className="text-danger"
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">End Date</label>
                                    <Field
                                      type="date"
                                      className="form-control"
                                      name={`workExperience.${index}.endDate`}
                                    />
                                    <ErrorMessage
                                      name={`workExperience.${index}.endDate`}
                                      component="div"
                                      className="text-danger"
                                    />
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">Company Name</label>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name={`workExperience.${index}.companyName`}
                                    />
                                    <ErrorMessage
                                      name={`workExperience.${index}.companyName`}
                                      component="div"
                                      className="text-danger"
                                    />
                                  </div>
                                  {index > 0 && (
                                    <div className="col-md-6 d-flex align-items-end mb-3">
                                      <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => remove(index)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            {values.workExperience.length < 2 && (
                              <div className="text-end">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                  onClick={() => push({
                                    jobTitle: '',
                                    companyName: '',
                                    jobDescription: '',
                                    startDate: '',
                                    endDate: ''
                                  })}
                                >
                                  Add Another +
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </FieldArray>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save and Continue'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantPreferences;