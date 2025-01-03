import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const token = searchParams.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setAlertType("danger");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { token, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      setAlertType("success");
      setMessage(response.data.message);
      setTimeout(() => navigate("/dashboard"), 1000);
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
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword} className="card p-4 shadow">
        <div className="mb-3">
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter your new password..."
          />
        </div>
        <div className="mb-3">
          <label>Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your new password..."
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {message && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;
