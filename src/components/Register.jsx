import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Prepare form data to include file upload
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("avatar", avatar);
    formData.append("password", password);

    try {
      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const message = response.data;

      // Set success or error message based on response
      if (message === "Registration successful") {
        setAlertType("success");
        setMessage("Registration successful.");
      } else {
        setAlertType("danger");
        setMessage(message || "Registration failed.");
      }

      // Clear message and alert after 3 seconds
      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 3000);
    } catch (error) {
      // Handle errors, including server error messages
      setAlertType("danger");
      setMessage(
        error.response?.data || "An error occurred during registration."
      );

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 3000);
    }

    // Reset form fields after submission
    setFullName("");
    setUsername("");
    setEmail("");
    setAvatar(null);
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
        <form onSubmit={handleRegister} className="card p-4 shadow mb-5">
          {/* Full Name Field */}
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

          {/* Username Field */}
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

          {/* Email Field */}
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

          {/* Avatar Upload Field */}
          <div className="mb-3">
            <label>Photo:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setAvatar(e.target.files[0])}
              required
            />
          </div>

          {/* Password Field */}
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

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Register
          </button>

          {/* Link to Login */}
          <strong className="mt-2">
            Already have an account? <a href="/">Click here</a>
          </strong>

          {/* Alert Messages */}
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
