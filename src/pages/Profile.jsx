import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import Spinner from "../components/Spinner";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

function Profile({ setUserImage }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [userImage, setUserImageState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = response.data;
        console.log(userData);

        setUserDetails(userData);

        if (userData.image) {
          const serverUrl = "http://localhost:8080/";
          const fileUrl = `${serverUrl}${userData.image.replace(/\\/g, "/")}`;
          setUserImageState(fileUrl);
          setUserImage(fileUrl);
        }
        setLoading(false);
      } catch (error) {
        setAlert({
          message: "Failed to fetch user details. Please try again.",
          type: "danger",
        });
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, navigate, setUserImage]);

  if (loading) return <Spinner />;

  if (!userDetails) {
    return (
      <div className={`alert alert-${alert.type} mt-3`}>
        {alert.message || "No user details available."}
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
                <strong>Username:</strong> {userDetails.username}
              </p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
