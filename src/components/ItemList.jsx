import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import dayjs from "dayjs";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const userId = localStorage.getItem("userId");
      const storedUsername = localStorage.getItem("username");
      const avatarIcon = localStorage.getItem("icon");

      if (storedUsername && userId) {
        setUsername(storedUsername);
        setAvatar(avatarIcon);
      } else if (!userId) {
        setError("User not logged in or userId not found.");
        return;
      } else {
        navigate("/");
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/tasks/${userId}`
        );
        setItems(response.data);
      } catch (err) {
        setError("Error fetching tasks.");
      }
    };

    fetchItems();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/tasks/delete/${id}`);
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.taskName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar
        username={username}
        userIcon={avatar}
        handleLogout={handleLogout}
      />
      <div
        className="container col-lg-10 col-md-9 d-flex flex-column justify-content-center"
        style={{ marginTop: "135px" }}
      >
        <h2>Your Items</h2>

        {/* Show Add Task button */}
        <Link to="/addTask" className="btn btn-primary mb-3">
          Add New Task
        </Link>

        {/* Display error if there is one */}
        {error && <p className="text-danger">{error}</p>}

        {/* Only show search and table if there are items */}
        {items.length > 0 ? (
          <>
            <form className="mb-3">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control col-8"
              />
            </form>

            <table className="table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Task Description</th>
                  <th>1st Created Date</th>
                  <th>Last Updated Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.taskName}</td>
                    <td>{item.taskDescription}</td>
                    <td>
                      {dayjs(item.createdAt).format("DD-MM-YYYY hh:mm A")}
                    </td>
                    <td>
                      {item.updatedAt
                        ? dayjs(item.updatedAt).format("DD-MM-YYYY hh:mm A")
                        : ""}
                    </td>
                    <td>
                      <div className="d-grid gap-1 d-lg-block">
                        <Link
                          to={`/update/${item.id}`}
                          className="btn btn-warning me-2 mb-2 mb-md-0"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex">
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    className={`btn btn-sm mx-1 ${
                      number + 1 === currentPage
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => handlePageChange(number + 1)}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="alert alert-warning">No tasks available.</p>
        )}
      </div>
    </>
  );
};

export default ItemList;
