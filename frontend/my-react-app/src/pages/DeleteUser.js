import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const DeleteUser = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/admin/delete-user",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVariant("success");
      setMessage(res.data.message);
    } catch (err) {
      console.error("Delete error:", err);
      setVariant("danger");
      setMessage(err.response?.data?.message || "Error deleting user.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>🗑 Delete User Account</h2>
      {message && <Alert variant={variant}>{message}</Alert>}
      <Form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="danger" type="submit">
          Delete User
        </Button>
      </Form>
    </Container>
  );
};

export default DeleteUser;
