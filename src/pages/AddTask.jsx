import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

function AddTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PENDING",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const userDetails = localStorage.getItem("userDetails")
      ? JSON.parse(localStorage.getItem("userDetails"))
      : null;
    const userId = userDetails?.id;

    if (!userId) {
      setAlert({
        message: "User not authenticated. Please login.",
        type: "danger",
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        API_ENDPOINTS.TASKS.POST_TASKS,
        { ...formData, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlert({ message: "Task added successfully!", type: "success" });

      setTimeout(() => {
        navigate(`/view-tasks/${userId}`);
      }, 1000);
    } catch (error) {
      setAlert({
        message:
          error.response?.data?.message ||
          "Failed to add task. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);

      setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 5000);
    }
  };

  return (
    <div className="container py-5">
      <br />
      <br />
      <br />
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center mb-4">Add New Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Task Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={formData.title}
                onChange={handleChange}
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
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Task"}
              </button>
            </div>
            {alert.message && (
              <div className={`alert alert-${alert.type} mt-3`} role="alert">
                {alert.message}
              </div>
            )}
          </form>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default AddTask;
