import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

const HRModifyProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/applicantProfile/${userId}`);
        const user = response.data;

        setInitialValues({
          name: user.Name || '',
          email: user.Email || '',
          phone: user.phone || '',
          dateOfBirth: user.DateOfBirth?.split('T')[0] || '',
          workingID: user.WorkingID || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to load HR data:', error);
        Swal.fire('Error', 'Could not load profile data', 'error');
        setLoading(false);
      }
    };

    fetchHRData();
  }, [userId]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    workingID: Yup.string().required('Working ID is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(`http://localhost:3000/applicantProfile/update/${userId}`, {
        Name: values.name,
        Email: values.email,
        phone: values.phone,
        DateOfBirth: values.dateOfBirth,
        WorkingID: values.workingID,
      });

      Swal.fire('Success', 'Profile updated successfully!', 'success').then(() => {
        navigate('/hr-profile'); // redirect to HR profile
      });
    } catch (error) {
      console.error('Update failed:', error);
      Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading HR Profile...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Edit HR Profile</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <Field type="text" className="form-control" name="name" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <Field type="email" className="form-control" name="email" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <Field type="text" className="form-control" name="phone" />
              <ErrorMessage name="phone" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <Field type="date" className="form-control" name="dateOfBirth" />
              <ErrorMessage name="dateOfBirth" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label className="form-label">Working ID</label>
              <Field type="text" className="form-control" name="workingID" />
              <ErrorMessage name="workingID" component="div" className="text-danger" />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default HRModifyProfile;
