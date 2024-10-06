import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          fullName,
          username,
          email,
          password,
        }
      );

      const message = response.data;

      if (message === "Registration successful") {
        setAlertType("success");
      } else {
        setAlertType("danger");
      }

      setMessage(message || "Registration successful.");

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 3000);
    } catch (error) {
      setAlertType("danger");
      setMessage(error.response?.data?.message || "Registration failed.");

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 3000);
    }

    setFullName("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Navbar />
      <div
        className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
        style={{ marginTop: "75px" }}
      >
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="card p-4 shadow">
          <div className="mb-3">
            <label>Full Name:</label>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address."
            />
          </div>
          <div className="mb-3">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              title="Password must be at least 6 characters long."
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>{" "}
          <strong className="mt-2">
            Already have an account? <a href="/">Click here</a>
          </strong>
          <br />
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

export default Register;
