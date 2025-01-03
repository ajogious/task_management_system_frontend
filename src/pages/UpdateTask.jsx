import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

function UpdateTask() {
  const { taskId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const taskFromState = location.state?.task;
  const userId = location.state?.userId;

  const [title, setTitle] = useState(taskFromState?.title || "");
  const [description, setDescription] = useState(
    taskFromState?.description || ""
  );
  const [status, setStatus] = useState(taskFromState?.status || "PENDING");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const getAuthToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    if (!taskFromState && userId && taskId) {
      const fetchTaskDetails = async () => {
        try {
          setLoading(true);
          const token = getAuthToken();
          const response = await axios.get(
            API_ENDPOINTS.TASKS.UPDATE_TASK(taskId),
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const taskData = response.data;
          setTitle(taskData.title);
          setDescription(taskData.description);
          setStatus(taskData.status);
        } catch (error) {
          setMessage("Failed to fetch task details.");
          setAlertType("danger");
        } finally {
          setLoading(false);
        }
      };

      fetchTaskDetails();
    }
  }, [taskId, userId, taskFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = { title, description, status };
    const token = getAuthToken();

    try {
      setLoading(true);
      await axios.put(
        API_ENDPOINTS.TASKS.UPDATE_TASK(userId, taskId),
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Task updated successfully!");
      setAlertType("success");

      setTimeout(() => {
        navigate(`/view-tasks/${userId}`);
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update task. Please try again."
      );
      setAlertType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container col-lg-6 col-md-8 col-10 d-flex flex-column justify-content-center"
      style={{ marginTop: "100px", marginBottom: "70px" }}
    >
      <h2>Update Task</h2>
      {loading && <Spinner />}
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
            placeholder="Enter task title"
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
            placeholder="Enter task description"
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
            {loading ? "Updating..." : "Update Task"}
          </button>
        </div>
        {message && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default UpdateTask;
