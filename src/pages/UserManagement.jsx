import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../services/API_ENDPOINTS";
import Spinner from "../components/Spinner";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const resetMessage = () => {
    setTimeout(() => {
      setMessage("");
      setAlertType("");
    }, 5000);
  };

  const fetchUsers = async (isInitialLoad = false) => {
    if (isInitialLoad) setPageLoading(true);
    else setTableLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(API_ENDPOINTS.ADMIN.USERS, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage - 1,
          size: rowsPerPage,
          search: searchTerm.trim(),
        },
      });

      const users = response.data.content || [];
      const totalPages = response.data.totalPages || 1;

      setUsers(users);
      setTotalPages(totalPages);
    } catch (error) {
      setMessage("Failed to fetch users. Please try again.");
      setAlertType("danger");
      resetMessage();
    } finally {
      setPageLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(true);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, rowsPerPage, searchTerm]);

  const openModal = (action, user) => {
    setModalAction(action);
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalAction("");
    setSelectedUser(null);
    setShowModal(false);
  };

  const confirmAction = async () => {
    if (!selectedUser || !modalAction) return;

    const token = localStorage.getItem("authToken");
    setActionLoading(true);

    try {
      if (modalAction === "suspend") {
        await axios.put(
          API_ENDPOINTS.ADMIN.SUSPEND_USER(selectedUser.id),
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage("User suspended successfully.");
      } else if (modalAction === "activate") {
        await axios.put(
          API_ENDPOINTS.ADMIN.ACTIVATE_USER(selectedUser.id),
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage("User activated successfully.");
      } else if (modalAction === "delete") {
        await axios.delete(API_ENDPOINTS.ADMIN.DELETE_USER(selectedUser.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("User deleted successfully.");
      }
      setAlertType("success");
      fetchUsers();
    } catch (error) {
      setMessage("Failed to perform action. Please try again.");
      setAlertType("danger");
    } finally {
      setActionLoading(false);
      closeModal();
      resetMessage();
    }
  };

  const handleUserDetails = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return pageLoading ? (
    <Spinner />
  ) : (
    <div
      className="container"
      style={{ marginTop: "100px", marginBottom: "100px" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h2>User Management</h2>
        {message && (
          <div className={`alert alert-${alertType}`} role="alert">
            {message}
          </div>
        )}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
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
              <th>Email</th>
              <th>Username</th>
              <th>Phone No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableLoading ? (
              <tr>
                <td colSpan="4" className="text-center">
                  <Spinner />
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.phoneNo}</td>
                  <td>
                    {user.active ? (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => openModal("suspend", user)}
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => openModal("activate", user)}
                      >
                        Activate
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => openModal("delete", user)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUserDetails(user.id)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <p>Showing {users.length} users</p>
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
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backdropFilter: "blur(5px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalAction.charAt(0).toUpperCase() + modalAction.slice(1)}{" "}
                  User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to {modalAction} this user?</p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Spinner /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
