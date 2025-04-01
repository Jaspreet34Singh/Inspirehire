import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  // Password validation function
  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(newPassword)) {
      return setError(
        "Password must be at least 8 characters, include an uppercase letter, lowercase letter, number, and special character."
      );
    }

    try {
      await axios.put("http://localhost:3000/auth/change-password", 
        { newPassword }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Password changed successfully!");
      localStorage.removeItem("userId"); // Optional cleanup
      navigate("/login");
    } catch (err) {
      console.error("Password update error:", err);
      setError("Failed to change password.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Change Your Password</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleChangePassword}>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Form.Text className="text-muted">
            Must be 8+ chars, with uppercase, lowercase, number, and symbol.
          </Form.Text>
        </Form.Group>
        <Button type="submit" variant="primary">
          Update Password
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePassword;
