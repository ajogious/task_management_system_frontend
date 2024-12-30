import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProfile = ({ setUserImage }) => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/auth/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetails(response.data);
        if (response.data.image) {
          const serverUrl = "http://localhost:8080/";
          const fileUrl = `${serverUrl}${response.data.image.replace(
            "\\",
            "/"
          )}`;
          setCurrentImage(fileUrl);
        }
      } catch (error) {
        setMessage("Failed to fetch user details.");
        setAlertType("danger");
      }
    };

    fetchUserDetails();
  }, [navigate, userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const user = {
      fullName: userDetails.fullName,
      username: userDetails.username,
      email: userDetails.email,
      phoneNo: userDetails.phoneNo,
      address: userDetails.address,
      gender: userDetails.gender,
    };
    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );

    if (avatar) {
      formData.append("file", avatar);
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://localhost:8080/api/auth/update-profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedImagePath = response.data.imagePath;
      const serverUrl = "http://localhost:8080/";
      const updatedUserDetails = {
        ...userDetails,
        image: updatedImagePath,
      };
      localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));

      // Update the user image in the parent component
      setUserImage(`${serverUrl}${updatedImagePath}`);

      setMessage("Profile updated successfully.");
      setAlertType("success");
      setTimeout(() => navigate(`/profile/${userId}`), 2000);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "An error occurred during update.";
      setAlertType("danger");
      setMessage(backendMessage);
    }
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
      <h2>Update Profile</h2>
      <form onSubmit={handleUpdate} className="card p-4 shadow mb-5">
        <div className="mb-3">
          <label>Full Name:</label>
          <input
            type="text"
            className="form-control"
            value={userDetails.fullName || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, fullName: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            value={userDetails.username || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={userDetails.email || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Phone No:</label>
          <input
            type="tel"
            className="form-control"
            value={userDetails.phoneNo || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, phoneNo: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Home Address:</label>
          <input
            type="text"
            className="form-control"
            value={userDetails.address || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, address: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Gender:</label>
          <select
            className="form-select"
            value={userDetails.gender || "Male"}
            onChange={(e) =>
              setUserDetails({ ...userDetails, gender: e.target.value })
            }
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
            className="form-control"
            type="file"
            id="avatar-upload"
            accept="image/png, image/jpeg"
            onChange={handleImagePreview}
            ref={fileInputRef}
          />
          <img
            id="image-preview"
            src={currentImage || "#"}
            alt="Avatar Preview"
            className="img-fluid mt-2"
            style={{
              maxWidth: "150px",
              display: currentImage ? "block" : "none",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
        {message && (
          <div className={`mt-2 alert alert-${alertType}`}>{message}</div>
        )}
      </form>
    </div>
  );
};

export default UpdateProfile;
