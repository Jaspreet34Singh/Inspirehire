import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserRegister = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    image: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[!@#$%^&*]/, "Must contain at least one special character")
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    dob: Yup.date().required("Date of birth is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("phone", values.phone);
    formData.append("dob", values.dob);
    formData.append("image", values.image);

    try {
      const response = await axios.post("/register/form-data", formData);
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
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, isSubmitting, errors }) => (
                  <Form encType="multipart/form-data">
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
                      <Field type="text" className="form-control" name="phone" />
                      <ErrorMessage name="phone" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <Field type="date" className="form-control" name="dob" />
                      <ErrorMessage name="dob" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                      />
                      <ErrorMessage name="image" component="div" className="text-danger" />
                    </div>

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