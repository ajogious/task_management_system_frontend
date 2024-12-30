import React, { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Male");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation of image
    if (!avatar) {
      setMessage("Please upload an avatar.");
      setAlertType("danger");
      return;
    }
    if (avatar.size > 2 * 1024 * 1024) {
      setMessage("File size exceeds 2MB.");
      setAlertType("danger");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(avatar.type)) {
      setMessage("Invalid file type. Only JPEG and PNG are allowed.");
      setAlertType("danger");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    const user = {
      fullName,
      username,
      email,
      phoneNo,
      address,
      gender,
      password,
    };
    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );
    formData.append("file", avatar);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const message = response.data.message;
      setAlertType("success");
      setMessage(message);

      // Redirect to Dashboard
      setTimeout(() => navigate("/login"), 2000);

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        "An error occurred during registration.";
      setAlertType("danger");
      setMessage(backendMessage);

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
    }

    // Reset form fields
    setFullName("");
    setUsername("");
    setEmail("");
    setPhoneNo("");
    setAddress("");
    setGender("Male");
    setAvatar(null);
    setPassword("");
    fileInputRef.current.value = "";
    document.getElementById("image-preview").src = "#";
    document.getElementById("image-preview").style.display = "none";
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imagePreview = document.getElementById("image-preview");
        imagePreview.src = event.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  return (
    <div
      className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
      style={{ marginTop: "100px", marginBottom: "70px" }}
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
            placeholder="Enter your fullname..."
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
            placeholder="Choose a username..."
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
            placeholder="Enter your email..."
          />
        </div>
        {/* PhoneNo Field */}
        <div className="mb-3">
          <label>Phone No:</label>
          <input
            type="tel"
            className="form-control"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
            placeholder="Your phone number..."
          />
        </div>
        {/* Address Field */}
        <div className="mb-3">
          <label>Home Address:</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter your home address..."
          />
        </div>
        {/* Gender Field */}
        <div className="mb-3">
          <label>Gender:</label>
          <select
            className="form-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Avatar Upload Field */}
        <div className="mb-3">
          <label htmlFor="avatar-upload" className="custom-file-label">
            Upload Image
          </label>
          <input
            className="form-control"
            type="file"
            id="avatar-upload"
            accept="image/png, image/jpeg"
            onChange={handleImagePreview}
            ref={fileInputRef}
            required
          />
          <img
            id="image-preview"
            src="#"
            alt="Avatar Preview"
            className="img-fluid mt-2"
            style={{
              maxWidth: "150px",
              display: "none",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        {/* Password Field */}
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
              placeholder="Enter a password..."
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
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Register
        </button>
        {/* Alert Messages */}
        {message && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {message}
          </div>
        )}
        <p className="mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
