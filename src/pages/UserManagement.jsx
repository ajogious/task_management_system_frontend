import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8080/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage - 1,
            size: rowsPerPage,
            search: searchTerm.trim(),
          },
        }
      );

      const users = response.data.content || [];
      const totalPages = response.data.totalPages || 1;

      const statsPromises = users.map((user) =>
        axios
          .get(`http://localhost:8080/api/dashboard/stats/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => ({ ...user, stats: res.data }))
      );

      const usersWithStats = await Promise.all(statsPromises);

      setUsers(usersWithStats);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      setMessage("Failed to fetch users. Please try again.");
      setAlertType("danger");
      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
    }
  };

  const openModal = (action, user) => {
    setModalAction(action);
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalAction(null);
    setSelectedUser(null);
    setShowModal(false);
  };

  const confirmAction = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("authToken");

    try {
      if (modalAction === "suspend") {
        await axios.put(
          `http://localhost:8080/api/admin/${selectedUser.id}/suspend`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("User suspended successfully.");
      } else if (modalAction === "activate") {
        await axios.put(
          `http://localhost:8080/api/admin/${selectedUser.id}/activate`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("User activated successfully.");
      } else if (modalAction === "delete") {
        await axios.delete(
          `http://localhost:8080/api/admin/user/${selectedUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("User deleted successfully.");
      }

      setAlertType("success");
      fetchUsers();
    } catch (error) {
      setMessage("Failed to perform action. Please try again.");
      setAlertType("danger");
    } finally {
      setTimeout(() => {
        setMessage("");
        setAlertType("");
      }, 5000);
      closeModal();
    }
  };

  const handleUserDetails = (userId) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, rowsPerPage, searchTerm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="container"
      style={{ marginTop: "100px", marginBottom: "100px" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h2>User Management</h2>
        {message && (
          <div className={`alert alert-${alertType} mt-3`} role="alert">
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
              <th>Total Tasks</th>
              <th>Completed Tasks</th>
              <th>Pending Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.phoneNo}</td>
                  <td>{user.stats?.totalTasks || 0}</td>
                  <td>{user.stats?.completedTasks || 0}</td>
                  <td>{user.stats?.pendingTasks || 0}</td>
                  <td>
                    {user.active ? (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => openModal("suspend", user)}
                      >
                        Suspend User
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => openModal("activate", user)}
                      >
                        Activate User
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => openModal("delete", user)}
                    >
                      Delete User
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUserDetails(user.id)}
                    >
                      See Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
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
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Confirm{" "}
                  {modalAction === "delete"
                    ? "Deletion"
                    : modalAction === "suspend"
                    ? "Suspension"
                    : "Activation"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to{" "}
                  {modalAction === "delete"
                    ? "delete this user"
                    : modalAction === "suspend"
                    ? "suspend this user"
                    : "activate this user"}
                  ?
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmAction}>
                  Confirm
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
