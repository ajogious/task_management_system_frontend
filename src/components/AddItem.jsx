import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CTO from "./CTO";

const AddTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const avatarIcon = localStorage.getItem("icon");

    if (storedUsername) {
      setUsername(storedUsername);
      setAvatar(avatarIcon);
    } else {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      displayMessage("danger", "Failed to add task: No user is logged in.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/tasks/add", {
        taskName,
        taskDescription,
        user: { id: userId },
      });

      displayMessage("success", "Task added successfully");
      resetForm();
    } catch (error) {
      displayMessage("danger", "Failed to add task.");
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
  };

  const displayMessage = (type, messageText) => {
    setAlertType(type);
    setMessage(messageText);

    setTimeout(() => {
      setMessage("");
      setAlertType("");
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.clear(); // Wipe everything from localStorage
    navigate("/"); // Redirect to login page
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
        style={{ marginTop: "135px" }}
      >
        <h2>Add Task</h2>
        <form onSubmit={handleAddTask}>
          <div className="mb-3">
            <label>Task Name</label>
            <input
              type="text"
              className="form-control"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Task Description</label>
            <textarea
              className="form-control"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary me-3">
            Add Task
          </button>
          <CTO />
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

export default AddTask;
