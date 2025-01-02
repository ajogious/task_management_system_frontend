import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css"; // Import the CSS file for styling

function Profile({ setUserImage }) {
  const { userId } = useParams();
  console.log(userId);

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [userImage, setUserImageState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserDetails(response.data);
        console.log(response.data);

        if (response.data.image) {
          const serverUrl = "http://localhost:8080/";
          const fileUrl = `${serverUrl}${response.data.image.replace(
            "\\",
            "/"
          )}`;
          setUserImageState(fileUrl);
          setUserImage(fileUrl);
        }

        setLoading(false);
      } catch (error) {
        setMessage("Failed to fetch user details:");
        setAlertType("danger");
        navigate("/login");
      }
    };

    fetchUserDetails();
  }, [userId, navigate, setUserImage]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userDetails) {
    return (
      <div className={`alert alert-${alertType} mt-3`}>
        No user details available.
      </div>
    );
  }

  return (
    <div className="Profile" style={{ marginTop: "120px" }}>
      <div className="container profile-container">
        <div className="row justify-content-center text-center text-md-start">
          <h2>User Profile</h2>
          <div className="col-md-4">
            <div className="profile-img">
              <img
                src={userImage || "default_user.jpg"}
                alt="User"
                className="img-fluid card"
              />
            </div>
            <Link
              to={`/update-profile/${userId}`}
              className="btn btn-primary mt-3"
            >
              Update Profile
            </Link>
          </div>
          <div className="col-md-7 d-flex flex-column align-items-center align-items-md-start">
            <div className="profile-details mb-5">
              <h3 className="profile-name">
                {userDetails.fullName || "User Name"}
              </h3>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.phoneNo}
              </p>
              <p>
                <strong>Address:</strong> {userDetails.address}
              </p>
              <p>
                <strong>Gender:</strong> {userDetails.gender}
              </p>
              <p>
                <strong>Role:</strong> {userDetails.role}
              </p>
              <p>
                <strong>Account Created:</strong>{" "}
                {new Date(userDetails.created).toLocaleString()}
              </p>
              {userDetails.updated && (
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(userDetails.updated).toLocaleString()}
                </p>
              )}
              {userDetails.stats && (
                <div className="profile-stats">
                  <h4>Task Stats</h4>
                  <p>Total Tasks: {userDetails.stats.totalTasks}</p>
                  <p>Completed Tasks: {userDetails.stats.completedTasks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
