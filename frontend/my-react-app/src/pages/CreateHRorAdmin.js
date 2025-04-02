import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const CreateHRorAdmin = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    role: "2", // Default: HR
    workingID: "",
    image: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone must be 10 digits")
      .required("Phone number is required"),
    dateOfBirth: Yup.date().required("Date of Birth is required"),
    role: Yup.string().required(),
    workingID: Yup.string().when("role", {
      is: "2",
      then: (schema) => schema.required("Working ID is required for HR"),
    }),
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("dateOfBirth", values.dateOfBirth);
      formData.append("role", values.role);
      formData.append("password", "password123"); // Default password

      if (values.role === "2") {
        formData.append("WorkingID", values.workingID);
      }

      formData.append("image", values.image);

      await axios.post("http://localhost:3000/admin/create-user", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success!", "Account created successfully", "success");
      resetForm();
      setPreview(null);
      navigate("/admin-dashboard");
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to create user" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Admin / HR Account</h2>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, values, isSubmitting, errors }) => (
          <Form encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <Field type="text" className="form-control" name="name" />
              <ErrorMessage name="name" className="text-danger" component="div" />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <Field type="email" className="form-control" name="email" />
              <ErrorMessage name="email" className="text-danger" component="div" />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <Field type="text" className="form-control" name="phone" />
              <ErrorMessage name="phone" className="text-danger" component="div" />
            </div>

            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <Field type="date" className="form-control" name="dateOfBirth" />
              <ErrorMessage name="dateOfBirth" className="text-danger" component="div" />
            </div>

            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <Field as="select" name="role" className="form-select">
                <option value="2">HR</option>
                <option value="1">Admin</option>
              </Field>
            </div>

            {values.role === "2" && (
              <div className="mb-3">
                <label className="form-label">Working ID</label>
                <Field type="text" className="form-control" name="workingID" />
                <ErrorMessage name="workingID" className="text-danger" component="div" />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files[0];
                  setFieldValue("image", file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
              <ErrorMessage name="image" className="text-danger" component="div" />
            </div>

            {preview && (
              <div className="mb-3">
                <p>Image Preview:</p>
                <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxWidth: "120px" }} />
              </div>
            )}

            {errors.submit && <div className="text-danger mb-3">{errors.submit}</div>}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default CreateHRorAdmin;
