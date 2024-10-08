import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CTO from "./CTO";
import dayjs from "dayjs";

const UserPage = () => {
  const [username, setUsername] = useState("");
  const [created, setCreated] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUsername = localStorage.getItem("username");
    const accCreated = localStorage.getItem("created");
    const avatarIcon = localStorage.getItem("icon");

    if (storedUsername) {
      setUsername(storedUsername);
      setCreated(accCreated);
      setAvatar(avatarIcon);
    } else {
      navigate("/"); // Redirect to login if user is not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    ["username", "created", "userId", "icon"].forEach((item) =>
      localStorage.removeItem(item)
    );
    navigate("/"); // Redirect to login page after logout
  };

  const handleAddTask = () => {
    navigate("/addtask");
  };

  return (
    <>
      <Navbar
        username={username}
        userIcon={avatar}
        handleLogout={handleLogout}
      />
      <div
        className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
        style={{ marginTop: "140px" }}
      >
        <h1>User Dashboard</h1>
        <h2 className="display-6">Welcome, {username}!</h2>
        <div className="mt-3">
          {/* Add Task Button */}
          <button className="btn btn-primary me-3" onClick={handleAddTask}>
            Add Task
          </button>

          {/* Call-to-action (CTO) component */}
          <CTO />

          {/* Account creation date display */}
          {created && (
            <div className="alert alert-success mt-3">
              Account created on: {dayjs(created).format("DD-MM-YYYY hh:mm A")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPage;
