import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Both fields are required.");
      setAlertType("danger");
      return;
    }

    const user = { email, password };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        user,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user: userDetails, message } = response.data;

      // Save token and user details to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      setAlertType("success");
      setMessage(message);

      // Redirect to Dashboard after successful login
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "An error occurred during login.";
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
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="card p-4 shadow mb-3">
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
