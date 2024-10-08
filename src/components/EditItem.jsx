import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CTO from "./CTO";

const EditItem = () => {
  const { id } = useParams();
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    const avatarIcon = localStorage.getItem("icon");

    if (storedUsername && storedUserId) {
      setUsername(storedUsername);
      setUserId(storedUserId);
      setAvatar(avatarIcon);
    } else {
      navigate("/"); // Redirect if not authenticated
      return;
    }

    const fetchItem = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/tasks/task/${id}`
        );
        setTaskName(data.taskName || "");
        setTaskDescription(data.taskDescription || "");
      } catch (error) {
        displayMessage("danger", "Error fetching item.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.clear(); // Wipe everything from localStorage
    navigate("/");
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/tasks/update/${id}`, {
        taskName,
        taskDescription,
        user: { id: userId },
      });
      displayMessage("success", "Task updated successfully");
    } catch (error) {
      displayMessage("danger", "Failed to update task.");
    }
  };

  const displayMessage = (type, messageText) => {
    setAlertType(type);
    setMessage(messageText);
    setTimeout(() => {
      setMessage("");
      setAlertType("");
    }, 3000);
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
        <h2>Edit Item</h2>

        {isLoading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <form onSubmit={handleUpdateItem}>
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
            <button type="submit" className="btn btn-primary me-2">
              Update Item
            </button>
            <CTO />
            {message && (
              <div className={`alert alert-${alertType} mt-3`} role="alert">
                {message}
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default EditItem;
