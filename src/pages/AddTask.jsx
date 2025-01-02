import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const userDetails = localStorage.getItem("userDetails")
      ? JSON.parse(localStorage.getItem("userDetails"))
      : null;
    const userId = userDetails?.id;

    if (!userId) {
      setMessage("User not authenticated. Please login.");
      setAlertType("danger");
      return;
    }

    const taskData = {
      title,
      description,
      status,
      userId,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/tasks",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Task added successfully!");
      setAlertType("success");
      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);

      setTimeout(() => {
        navigate(`/view-tasks/${userId}`);
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add task. Please try again."
      );
      setAlertType("danger");

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
    } finally {
      setLoading(false);

      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
    }
  };

  return (
    <div
      className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
      style={{ marginTop: "100px", marginBottom: "70px" }}
    >
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Task Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Task Description
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-control"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
        {/* Alert Messages */}
        {message && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default AddTask;
