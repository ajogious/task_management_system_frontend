import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

const UpdateProfile = ({ setUserImage }) => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const SERVER_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          API_ENDPOINTS.USER.USER_PROFILE(userId),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = response.data;
        setUserDetails(userData);
        if (userData.image) {
          setCurrentImage(`${SERVER_URL}/${userData.image.replace("\\", "/")}`);
        }
        setLoading(false);
      } catch (error) {
        setFeedback({
          message: "Failed to fetch user details.",
          type: "danger",
        });
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(userDetails)], { type: "application/json" })
    );
    if (avatar) formData.append("file", avatar);

    try {
      const response = await axios.put(
        API_ENDPOINTS.USER.UPDATE_PROFILE(userId),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedImagePath = response.data.imagePath;
      setUserImage(`${SERVER_URL}/${updatedImagePath}`);
      setFeedback({
        message: "Profile updated successfully.",
        type: "success",
      });
      setTimeout(() => navigate(`/profile/${userId}`), 2000);
    } catch (error) {
      setFeedback({
        message:
          error.response?.data?.message || "An error occurred during update.",
        type: "danger",
      });
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatar(file);
      reader.readAsDataURL(file);
    } else {
      setFeedback({
        message: "Invalid file type. Please upload a valid image.",
        type: "danger",
      });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div
      className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
      style={{ marginTop: "100px", marginBottom: "70px" }}
    >
      <h2>Update Profile</h2>
      <form onSubmit={handleUpdate} className="card p-4 shadow mb-5">
        {["fullName", "username", "email", "phoneNo", "address"].map(
          (field) => (
            <div className="mb-3" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type={field === "email" ? "email" : "text"}
                className="form-control"
                value={userDetails[field] || ""}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, [field]: e.target.value })
                }
                required
              />
            </div>
          )
        )}
        <div className="mb-3">
          <label>Gender:</label>
          <select
            className="form-select"
            value={userDetails.gender || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, gender: e.target.value })
            }
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="avatar-upload">Upload Image:</label>
          <input
            type="file"
            id="avatar-upload"
            className="form-control"
            accept="image/png, image/jpeg"
            onChange={handleImagePreview}
            ref={fileInputRef}
          />
        </div>
        {currentImage && (
          <img
            src={currentImage}
            alt="Avatar Preview"
            className="img-fluid mt-2"
            style={{
              maxWidth: "150px",
              display: currentImage ? "block" : "none",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        )}
        <button type="submit" className="btn btn-primary mt-3">
          Update Profile
        </button>
        {feedback.message && (
          <div className={`mt-2 alert alert-${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateProfile;
