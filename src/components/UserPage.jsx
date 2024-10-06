import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CTO from "./CTO";
import dayjs from "dayjs";

const UserPage = () => {
  const [username, setUsername] = useState("");
  const [created, setCreated] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem("username");
    const accCreated = localStorage.getItem("createdAt");
    if (storedUsername) {
      setUsername(storedUsername);
      setCreated(accCreated);
    } else {
      navigate("/"); // Redirect to login if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear localStorage to log out the user
    localStorage.removeItem("username");
    localStorage.removeItem("accCreated");
    navigate("/"); // Redirect to login page
  };

  const handleAddTask = () => {
    navigate("/addtask");
  };

  return (
    <>
      <Navbar username={username} handleLogout={handleLogout} />
      <div
        className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
        style={{ marginTop: "140px" }}
      >
        <h1>User Dashboard</h1>
        <h2 className="display-6">Welcome, {username}!</h2>
        <div className="mt-3">
          <button className="btn btn-primary me-3" onClick={handleAddTask}>
            Add Task
          </button>
          <CTO />
          <div className="alert alert-success mt-3">
            Accounted was created on:{" "}
            {dayjs(created).format("DD-MM-YYYY hh:mm A")}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
