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
  const [userId, setUserId] = useState(""); // Add state for userId
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId"); // Get userId from localStorage
    if (storedUsername && storedUserId) {
      setUsername(storedUsername);
      setUserId(storedUserId); // Set userId in state
    } else {
      navigate("/"); // Redirect if not authenticated
    }

    const fetchItem = async () => {
      try {
        console.log(`Fetching task with ID: ${id}`);
        const response = await axios.get(
          `http://localhost:8080/api/tasks/task/${id}`
        );
        console.log("Task data fetched:", response.data);
        setTaskName(response.data.taskName || "");
        setTaskDescription(response.data.taskDescription || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching item:", error);
        setAlertType("danger");
        setMessage("Error fetching item.");
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/tasks/update/${id}`, {
        taskName,
        taskDescription,
        user: { id: userId }, // Pass the userId
      });
      setAlertType("success");
      setMessage("Task updated successfully");

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 3000);
    } catch (error) {
      setAlertType("danger");
      setMessage("Failed to update task.");

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 3000);
    }
  };

  return (
    <>
      <Navbar username={username} handleLogout={handleLogout} />
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
