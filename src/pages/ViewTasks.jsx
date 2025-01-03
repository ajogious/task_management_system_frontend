import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

function ViewTasks() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // States
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "ALL",
    rowsPerPage: 10,
    currentPage: 1,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [pageLoading, setPageLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, taskId: null });

  const { searchTerm, status, rowsPerPage, currentPage } = filters;

  useEffect(() => {
    fetchTasks(true);
  }, []);

  useEffect(() => {
    fetchTasks(false);
  }, [filters]);

  const fetchTasks = async (isInitialLoad) => {
    if (isInitialLoad) {
      setPageLoading(true);
    } else {
      setTableLoading(true);
    }

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(API_ENDPOINTS.TASKS.GET_TASKS(userId), {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage - 1,
          size: rowsPerPage,
          status: status !== "ALL" ? status : undefined,
          search: searchTerm || "",
        },
      });

      setTasks(response.data?._embedded?.taskDTOList || []);
      setTotalPages(response.data.page.totalPages);
    } catch (error) {
      showAlert("Failed to fetch tasks. Please try again.", "danger");
    } finally {
      setPageLoading(false);
      setTableLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 5000);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(API_ENDPOINTS.TASKS.DELETE_TASK(modal.taskId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      showAlert("Task deleted successfully.", "success");
      fetchTasks(false);
      closeModal();
    } catch (error) {
      showAlert("Failed to delete task. Please try again.", "danger");
      closeModal();
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const closeModal = () => setModal({ show: false, taskId: null });

  if (pageLoading) {
    return <Spinner />;
  }

  return (
    <div
      className="container"
      style={{ marginTop: "100px", marginBottom: "100px" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h2>View Tasks</h2>
        {alert.message && (
          <div className={`alert alert-${alert.type} mt-3`} role="alert">
            {alert.message}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="row g-3 mb-3">
        {/* Filter Inputs */}
        <div className="col-md-4">
          <select
            className="form-select"
            value={status}
            onChange={(e) => updateFilter("status", e.target.value)}
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
            placeholder="Search task..."
            value={searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={rowsPerPage}
            onChange={(e) =>
              updateFilter("rowsPerPage", parseInt(e.target.value, 10))
            }
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      {tableLoading ? (
        <Spinner />
      ) : (
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
                        onClick={() =>
                          navigate(`/update-task/${task.id}`, {
                            state: { task, userId },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          setModal({ show: true, taskId: task.id })
                        }
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
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <p>Showing {tasks.length} tasks</p>
        <div>
          <button
            className="btn btn-secondary btn-sm me-2"
            disabled={currentPage === 1}
            onClick={() =>
              updateFilter("currentPage", Math.max(currentPage - 1, 1))
            }
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
              updateFilter("currentPage", Math.min(currentPage + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modal.show && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            backdropFilter: "blur(5px)",
            overflow: "hidden",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button className="btn-close" onClick={closeModal}></button>
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
