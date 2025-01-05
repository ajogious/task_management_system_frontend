import React, { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNo: "",
    address: "",
    gender: "Male",
    password: "",
    avatar: null,
  });
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imagePreview = document.getElementById("image-preview");
        imagePreview.src = event.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, avatar: file });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { avatar, ...userDetails } = formData;

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

    const formPayload = new FormData();
    formPayload.append(
      "user",
      new Blob([JSON.stringify(userDetails)], { type: "application/json" })
    );
    formPayload.append("file", avatar);

    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH.REGISTER,
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setAlertType("success");
      setMessage(response.data.message);

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during registration.";
      setAlertType("danger");
      setMessage(errorMessage);
    } finally {
      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);

      setFormData({
        fullName: "",
        username: "",
        email: "",
        phoneNo: "",
        address: "",
        gender: "Male",
        password: "",
        avatar: null,
      });
      fileInputRef.current.value = "";
      const imagePreview = document.getElementById("image-preview");
      imagePreview.src = "#";
      imagePreview.style.display = "none";
    }
  };

  return (
    <div
      className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
      style={{ marginTop: "100px", marginBottom: "70px" }}
    >
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="card p-4 shadow mb-5">
        {[
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Username", name: "username", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone No", name: "phoneNo", type: "tel" },
          { label: "Home Address", name: "address", type: "text" },
        ].map(({ label, name, type }) => (
          <div className="mb-3" key={name}>
            <label>{label}:</label>
            <input
              type={type}
              className="form-control"
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              required
              placeholder={`Enter your ${label.toLowerCase()}...`}
            />
          </div>
        ))}

        <div className="mb-3">
          <label>Gender:</label>
          <select
            className="form-select"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="avatar-upload" className="custom-file-label">
            Upload Image
          </label>
          <input
            type="file"
            className="form-control"
            id="avatar-upload"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
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

        <div className="mb-3">
          <label>Password:</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              maxLength={8}
              minLength={4}
              required
              placeholder="Enter a password (4-8 characters)..."
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

        <button type="submit" className="btn btn-primary">
          Register
        </button>

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
