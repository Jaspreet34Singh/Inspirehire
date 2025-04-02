import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const EditProfile = () => {
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [educationData, setEducationData] = useState([]);
  const [workExpData, setWorkExpData] = useState([]);
  const [preferenceData, setPreferenceData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL parameter
  console.log(userId)
  
  // Fetch all user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:3000/jobs/categories');
        setCategories(categoriesResponse.data.categories);
        
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:3000/applicantProfile/${userId}`);
        setUserData(userResponse.data);
        
        // Fetch education data
        const educationResponse = await axios.get(`http://localhost:3000/applicantProfile/${userId}/education`);
        setEducationData(educationResponse.data);
        
        // Fetch work experience data
        const workExpResponse = await axios.get(`http://localhost:3000/applicantProfile/${userId}/workexp`);
        setWorkExpData(workExpResponse.data);
        
        // Fetch job preferences
        const preferenceResponse = await axios.get(`http://localhost:3000/applicantProfile/${userId}/preferences`);
        setPreferenceData(preferenceResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load user data',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Prepare initial values for Formik from fetched data
  const prepareInitialValues = () => {
    // Map education data
    const education = educationData.length > 0 ? {
      eduId: educationData[0].EduDetail_ID,
      degree: educationData[0].Degree || '',
      institute: educationData[0].InstitutionName || '',
      fieldOfStudy: educationData[0].Field_Of_Study || '',
      startDate: educationData[0].Start_Date ? new Date(educationData[0].Start_Date).toISOString().split('T')[0] : '',
      endDate: educationData[0].End_Date ? new Date(educationData[0].End_Date).toISOString().split('T')[0] : ''
    } : {
      eduId: null,
      degree: '',
      institute: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: ''
    };
    
    // Map job preferences to category IDs
    const jobPreferences = preferenceData.map(pref => ({
      prefId: pref.JobPref_ID,
      categoryId: pref.Category_ID,
      jobType: pref.JobType || 'Full-time',
      jobLocation: pref.JobLocation || 'Remote'
    }));
    
    // Map work experience data
    const workExperience = workExpData.length > 0 ? workExpData.map(work => ({
      workExpId: work.WorkExp_ID,
      jobTitle: work.Job_Title || '',
      companyName: work.CompanyName || '',
      jobDescription: work.JobDescription || '',
      startDate: work.StartDate ? new Date(work.StartDate).toISOString().split('T')[0] : '',
      endDate: work.EndDate ? new Date(work.EndDate).toISOString().split('T')[0] : ''
    })) : [{
      workExpId: null,
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      startDate: '',
      endDate: ''
    }];
    
    // Prepare personal info
    const personalInfo = {
      Name: userData?.Name || '',
      Email: userData?.Email || '',
      phone: userData?.phone || '',
      DateOfBirth: userData?.DateOfBirth ? new Date(userData.DateOfBirth).toISOString().split('T')[0] : ''
    };
    
    return {
      personalInfo,
      education,
      jobPreferences,
      workExperience
    };
  };

  // Validation schema for the form
  const validationSchema = Yup.object({
    personalInfo: Yup.object({
      Name: Yup.string().required('Full name is required'),
      Email: Yup.string().email('Invalid email format').required('Email is required'),
      phone: Yup.string().required('Phone number is required')
    }),
    education: Yup.object({
      degree: Yup.string().required('Degree is required'),
      institute: Yup.string().required('Institute name is required'),
      fieldOfStudy: Yup.string().required('Field of study is required'),
      startDate: Yup.date().required('Start date is required')
    }),
    jobPreferences: Yup.array().of(
      Yup.object({
        categoryId: Yup.number().required('Job category is required'),
        jobType: Yup.string().required('Job type is required'),
        jobLocation: Yup.string().required('Job location is required')
      })
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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Update personal information
      await axios.put(`http://localhost:3000/applicantProfile/update/${userId}`, {
        Name: values.personalInfo.Name,
        Email: values.personalInfo.Email,
        phone: values.personalInfo.phone,
        DateOfBirth: values.personalInfo.DateOfBirth
      });
      
      // Update or create education
      if (values.education.eduId) {
        await axios.put(`http://localhost:3000/applicantProfile/${userId}/education/${values.education.eduId}`, {
          Degree: values.education.degree,
          Start_Date: values.education.startDate,
          End_Date: values.education.endDate || null,
          InstitutionName: values.education.institute,
          Field_Of_Study: values.education.fieldOfStudy
        });
      } else {
        await axios.post('http://localhost:3000/applicantProfile/education', {
          USER_ID: userId,
          Degree: values.education.degree,
          Start_Date: values.education.startDate,
          End_Date: values.education.endDate || null,
          InstitutionName: values.education.institute,
          Field_Of_Study: values.education.fieldOfStudy
        });
      }
      
      // Handle job preferences
      // First, get the current preferences to determine what to update/delete/add
      const currentPreferences = await axios.get(`http://localhost:3000/applicantProfile/${userId}/preferences`);
      const currentPreferenceIds = currentPreferences.data.map(pref => pref.JobPref_ID);
      
      // For each preference in the form, update or create
      for (const pref of values.jobPreferences) {
        if (pref.prefId) {
          // Update existing preference
          await axios.put(`http://localhost:3000/applicantProfile/${userId}/preferences/${pref.prefId}`, {
            Category_ID: pref.categoryId,
            JobType: pref.jobType,
            JobLocation: pref.jobLocation
          });
        } else {
          // Create new preference
          await axios.post('http://localhost:3000/applicantProfile/job-preferences', {
            USER_ID: userId,
            Category_ID: pref.categoryId,
            JobType: pref.jobType,
            JobLocation: pref.jobLocation
          });
        }
      }
      
      // Delete any preferences that were removed
      const formPreferenceIds = values.jobPreferences
        .filter(pref => pref.prefId)
        .map(pref => pref.prefId);
      
      const prefsToDelete = currentPreferenceIds.filter(id => !formPreferenceIds.includes(id));
      
      for (const prefId of prefsToDelete) {
        await axios.delete(`http://localhost:3000/applicantprofile/${userId}/preferences/${prefId}`);
      }
      
      // Handle work experience
      // Get current work experience to determine what to update/delete/add
      const currentWorkExp = await axios.get(`http://localhost:3000/applicantProfile/${userId}/workexp`);
      const currentWorkExpIds = currentWorkExp.data.map(work => work.WorkExp_ID);
      
      // For each work experience in the form, update or create
      for (const work of values.workExperience) {
        if (work.workExpId) {
          // Update existing work experience
          await axios.put(`http://localhost:3000/applicantProfile/${userId}/workexp/${work.workExpId}`, {
            Job_Title: work.jobTitle,
            CompanyName: work.companyName,
            JobDescription: work.jobDescription,
            StartDate: work.startDate,
            EndDate: work.endDate || null
          });
        } else {
          // Create new work experience
          await axios.post('http://localhost:3000/applicantProfile/work-experience', {
            USER_ID: userId,
            workExperience: [{
              jobTitle: work.jobTitle,
              companyName: work.companyName,
              jobDescription: work.jobDescription,
              startDate: work.startDate,
              endDate: work.endDate || null
            }]
          });
        }
      }
      
      // Delete any work experiences that were removed
      const formWorkExpIds = values.workExperience
        .filter(work => work.workExpId)
        .map(work => work.workExpId);
      
      const workExpsToDelete = currentWorkExpIds.filter(id => !formWorkExpIds.includes(id));
      
      for (const workExpId of workExpsToDelete) {
        await axios.delete(`http://localhost:3000/applicantProfile/${userId}/workexp/${workExpId}`);
      }
      
      Swal.fire({
        title: 'Success!',
        text: 'Your profile has been updated!',
        icon: 'success',
        confirmButtonText: 'Continue to Profile'
      }).then(() => {
        // Redirect to applicant profile
        navigate(`/applicant-profile`);
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update profile',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your profile data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          User not found or error loading profile data.
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Edit Your Profile</h3>
            </div>
            <div className="card-body">
              <Formik
                initialValues={prepareInitialValues()}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form>
                    {/* Personal Information Section */}
                    <div className="mb-4">
                      <h4 className="mb-3 border-bottom pb-2">Personal Information</h4>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Full Name</label>
                          <Field type="text" className="form-control" name="personalInfo.Name" />
                          <ErrorMessage name="personalInfo.fullName" component="div" className="text-danger" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Date of Birth</label>
                          <Field type="date" className="form-control" name="personalInfo.DateOfBirth" />
                          <ErrorMessage name="personalInfo.dateOfBirth" component="div" className="text-danger" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email</label>
                          <Field type="email" className="form-control" name="personalInfo.Email" />
                          <ErrorMessage name="personalInfo.Email" component="div" className="text-danger" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Phone</label>
                          <Field type="text" className="form-control" name="personalInfo.phone" />
                          <ErrorMessage name="personalInfo.phone" component="div" className="text-danger" />
                        </div>
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="mb-4">
                      <h4 className="mb-3 border-bottom pb-2">Education</h4>
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
                          <label className="form-label">Field of Study</label>
                          <Field type="text" className="form-control" name="education.fieldOfStudy" />
                          <ErrorMessage name="education.fieldOfStudy" component="div" className="text-danger" />
                        </div>
                      </div>
                    </div>

                    {/* Job Categories Section */}
                    <div className="mb-4">
                      <h4 className="mb-3 border-bottom pb-2">Preferred Job Categories</h4>
                      <FieldArray name="jobPreferences">
                        {({ remove, push }) => (
                          <>
                            {values.jobPreferences.length > 0 ? (
                              values.jobPreferences.map((pref, index) => (
                                <div key={index} className="card mb-3 p-3 border-light">
                                  <div className="row">
                                    <div className="col-md-6 mb-3">
                                      <label className="form-label">Job Category</label>
                                      <Field 
                                        as="select" 
                                        className="form-select"
                                        name={`jobPreferences.${index}.categoryId`}
                                      >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                          <option 
                                            key={category.Category_ID} 
                                            value={category.Category_ID}
                                          >
                                            {category.Category_Name}
                                          </option>
                                        ))}
                                      </Field>
                                      <ErrorMessage
                                        name={`jobPreferences.${index}.categoryId`}
                                        component="div"
                                        className="text-danger"
                                      />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <label className="form-label">Job Type</label>
                                      <Field 
                                        as="select" 
                                        className="form-select"
                                        name={`jobPreferences.${index}.jobType`}
                                      >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Internship</option>
                                      </Field>
                                      <ErrorMessage
                                        name={`jobPreferences.${index}.jobType`}
                                        component="div"
                                        className="text-danger"
                                      />
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6 mb-3">
                                      <label className="form-label">Job Location</label>
                                      <Field 
                                        as="select" 
                                        className="form-select"
                                        name={`jobPreferences.${index}.jobLocation`}
                                      >
                                        <option value="Remote">Remote</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Hybrid">Hybrid</option>
                                      </Field>
                                      <ErrorMessage
                                        name={`jobPreferences.${index}.jobLocation`}
                                        component="div"
                                        className="text-danger"
                                      />
                                    </div>
                                    {values.jobPreferences.length > 1 && (
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
                              ))
                            ) : (
                              <div className="alert alert-warning">
                                No job preferences added. Please add at least one.
                              </div>
                            )}
                            <div className="text-end">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => push({
                                  prefId: null,
                                  categoryId: '',
                                  jobType: 'Full-time',
                                  jobLocation: 'Remote'
                                })}
                              >
                                Add Job Preference +
                              </button>
                            </div>
                          </>
                        )}
                      </FieldArray>
                    </div>

                    {/* Work Experience Section */}
                    <div className="mb-4">
                      <h4 className="mb-3 border-bottom pb-2">Work Experience</h4>
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
                                  <div className="col-12 mb-3">
                                    <label className="form-label">Job Description</label>
                                    <Field
                                      as="textarea"
                                      className="form-control"
                                      name={`workExperience.${index}.jobDescription`}
                                      rows="3"
                                    />
                                    <ErrorMessage
                                      name={`workExperience.${index}.jobDescription`}
                                      component="div"
                                      className="text-danger"
                                    />
                                  </div>
                                </div>
                                {values.workExperience.length > 1 && (
                                  <div className="row">
                                    <div className="col-12">
                                      <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => remove(index)}
                                      >
                                        Remove This Experience
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {values.workExperience.length < 3 && (
                              <div className="text-end">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                  onClick={() => push({
                                    workExpId: null,
                                    jobTitle: '',
                                    companyName: '',
                                    jobDescription: '',
                                    startDate: '',
                                    endDate: ''
                                  })}
                                >
                                  Add Work Experience +
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </FieldArray>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default EditProfile;