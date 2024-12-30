import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ViewTasks() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [currentPage, rowsPerPage, searchTerm, statusFilter]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage - 1, // Backend uses 0-based indexing
            size: rowsPerPage,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            search: searchTerm || "", // Default to empty string if searchTerm is empty
          },
        }
      );

      const taskData = response.data?._embedded?.taskDTOList || [];
      setTasks(taskData);
      setTotalPages(response.data.page.totalPages);
    } catch (error) {
      setMessage("Failed to fetch tasks. Please try again.");
      setAlertType("danger");
      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(
        `http://localhost:8080/api/tasks/user/${taskToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Task deleted successfully.");
      setAlertType("success");
      fetchTasks();
      closeModal();
      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
    } catch (error) {
      setMessage("Failed to delete task. Please try again.");
      setAlertType("danger");
      closeModal();
      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
    }
  };

  const handleEditBtn = (task) => {
    navigate(`/update-task/${task.id}`, { state: { task, userId } });
  };

  const openModal = (taskId) => {
    setTaskToDelete(taskId);
    setShowModal(true);
  };

  const closeModal = () => {
    setTaskToDelete(null);
    setShowModal(false);
  };

  return (
    <div
      className="container"
      style={{ marginTop: "100px", marginBottom: "100px" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h2>View Tasks</h2>
        {message && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {message}
          </div>
        )}
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search task with title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div
        className="table-responsive-lg"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>{new Date(task.created).toLocaleString()}</td>
                  <td>
                    {task.updated
                      ? new Date(task.updated).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditBtn(task)}
                      style={{ width: "70px", marginBottom: "10px" }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => openModal(task.id)}
                      style={{ width: "70px", marginBottom: "10px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <p>Showing {tasks.length} tasks</p>
        <div>
          <button
            className="btn btn-secondary btn-sm me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm ms-2"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTasks;
