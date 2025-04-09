import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Container } from "react-bootstrap";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      await axios.post("http://localhost:3000/auth/verify-security-question", {
        email,
        securityAnswer,
      });
      setStep(2);
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:3000/auth/reset-password", {
        email,
        newPassword,
      });
      setMessage("✅ Password reset successfully!");
      setStep(1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <Container className="mt-5">
      <h2>🔐 Forgot Password</h2>

      {message && <Alert variant="info">{message}</Alert>}

      {step === 1 && (
        <>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Answer Your Security Question</Form.Label>
            <Form.Control
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              type="text"
            />
          </Form.Group>
          <Button className="mt-3" onClick={handleVerify}>
            Verify
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
            />
          </Form.Group>
          <Button className="mt-3" onClick={handleReset}>
            Reset Password
          </Button>
        </>
      )}
    </Container>
  );
};

export default ForgotPassword;
