import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Email is required.");
      setAlertType("danger");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      const { message } = response.data;
      setAlertType("success");
      setMessage(message);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setAlertType("danger");
      setMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
      style={{ marginTop: "100px", marginBottom: "100px" }}
    >
      <h2>Forgot Password</h2>
      <form onSubmit={handlePasswordReset} className="card p-4 shadow">
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your registered email..."
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <p className="mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
        <p className="my-3">
          No account yet?{" "}
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </p>
        {message && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgottenPassword;
