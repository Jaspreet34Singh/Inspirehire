import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserRegister = () => {
  const [imagePreview, setImagePreview] = useState(null); // For previewing the image

  const initialValues = {
    name: "",
    email: "",
    password: "",
    Phone: "",
    DateOfBirth: "",
    image: "", // We'll store only the image name (file name) here
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[!@#$%^&*]/, "Must contain at least one special character")
      .required("Password is required"),
    Phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    DateOfBirth: Yup.date().required("Date of birth is required"),
    image: Yup.string().required("Image name is required"), // Store only the image name
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Send form data (only the name/path, not the file itself)
      const response = await axios.post("http://localhost:3000/register/form-data/submit", values);
      alert(response.data.message);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Error registering user" });
    }
    setSubmitting(false);
  };

  return (
    <div className="container md-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">User Registration</h2>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ setFieldValue, isSubmitting, values, errors }) => (
              <Form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <Field type="text" className="form-control" name="name" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <Field type="email" className="form-control" name="email" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <Field type="password" className="form-control" name="password" />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <Field type="text" className="form-control" name="Phone" />
                  <ErrorMessage name="Phone" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <Field type="date" className="form-control" name="DateOfBirth" />
                  <ErrorMessage name="DateOfBirth" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      if (file) {
                        const fileName = file.name; // Get the file name (not the full path)
                        setFieldValue("image", fileName); // Store file name
                        setImagePreview(URL.createObjectURL(file)); // Display preview
                      }
                    }}
                  />
                  <ErrorMessage name="image" component="div" className="text-danger" />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3">
                    <p>Image Preview:</p>
                    <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: "100px" }} />
                  </div>
                )}

                {errors.submit && <div className="text-danger">{errors.submit}</div>}

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
