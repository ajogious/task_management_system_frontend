import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = credentials;
    if (!email.trim() || !password.trim()) {
      setMessage("Both fields are required.");
      setAlertType("danger");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user: userDetails, message } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      setAlertType("success");
      setMessage(message);

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      setAlertType("danger");
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
      style={{ marginTop: "100px", marginBottom: "100px" }}
    >
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="card p-4 shadow mb-3">
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="text"
            className="form-control"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="Enter your email..."
          />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              maxLength={8}
              minLength={4}
              required
              placeholder="Enter your password..."
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {message}
          </div>
        )}
        <p className="my-3">
          No account yet?{" "}
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </p>
        <p className="my-3">
          <Link to="/forgot-password" className="text-primary">
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
