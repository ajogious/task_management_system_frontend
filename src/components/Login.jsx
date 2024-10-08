import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );

      if (response.data.message === "Login successful") {
        setAlertType("success");
        setMessage("Login successful");

        // Store user details in localStorage
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("created", response.data.createdAt);
        localStorage.setItem("icon", response.data.avatar_url);

        // Redirect to user profile page after login
        setTimeout(() => {
          navigate("/userpage");
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error logging in";
      setAlertType("danger");
      setMessage(errorMessage);
    }

    // Clear alert after 3 seconds
    setTimeout(() => {
      setMessage("");
      setAlertType("");
    }, 3000);
  };

  return (
    <>
      <Navbar
        username={localStorage.getItem("username")}
        userIcon={localStorage.getItem("icon")}
      />
      <div
        className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
        style={{ marginTop: "100px" }}
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="card p-4 shadow">
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <strong className="mt-2">
            No account yet? <a href="/register">Register here</a>
          </strong>
          {message && (
            <div className={`alert alert-${alertType} mt-3`} role="alert">
              {message}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
