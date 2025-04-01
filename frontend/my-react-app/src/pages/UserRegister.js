import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const [imagePreview, setImagePreview] = useState(null); // For previewing the image
  
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    Phone: "",
    DateOfBirth: "",
    image: null, // Store the actual file object
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
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("Phone", values.Phone);
      formData.append("DateOfBirth", values.DateOfBirth);
      formData.append("image", values.image); // Attach the file

      // Send the form data with the image file
      const response = await axios.post("http://localhost:3000/register/form-data/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Ensure file upload works
      });

      // Once the user is registered the previous token will be removed
      localStorage.removeItem("token");    // Remove JWT Token
      localStorage.removeItem("userRole"); // Remove Role
      localStorage.removeItem("User_ID"); 

      const response2 = await axios.post("http://localhost:3000/auth/login", {
        email: values.email,
        password: values.password,
      })

      // Store token in localStorage
      localStorage.setItem("token", response2.data.token);
      localStorage.setItem("userRole", response2.data.user.role);
      localStorage.setItem("User_ID", response2.data.user.id);

      Swal.fire({
        title: "Success!",
        text: `User registered successfully! Your User ID is ${response.data.userId}`,
        icon: "success",
        confirmButtonText: "OK"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/applicantPreferrence"); 
        }
      });
      
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Error registering user" });
    }
    setSubmitting(false);
  };

  return (
    <div className="container md-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
        <h1 className="fw-bold text-black">User Registration</h1>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ setFieldValue, isSubmitting, errors }) => (
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
                    accept="image/*"
                    
                    // This will show the epreview of the image inserted just now
                    onChange={(event) => {
                      const file = event.target.files[0];
                      if (file) {
                        setFieldValue("image", file); // Store the file object
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
