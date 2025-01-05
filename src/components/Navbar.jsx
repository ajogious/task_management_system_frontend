import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../services/API_ENDPOINTS";

function Navbar({ setMessage, setAlertType }) {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(null);

  const userLogin = () => localStorage.getItem("userDetails");

  const userDetails = userLogin()
    ? JSON.parse(localStorage.getItem("userDetails"))
    : null;
  const username = userDetails?.username || "";
  const role = userDetails?.role || "";

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        API_ENDPOINTS.AUTH.LOGOUT,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Logout successful.");
      setAlertType("success");
    } catch (error) {
      setMessage("Logout failed.");
      setAlertType("danger");
    } finally {
      setTimeout(() => {
        setMessage("");
        setAlertType("");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userDetails");
        navigate("/login");
      }, 1000);
    }
  };

  useEffect(() => {
    const updateImageFromStorage = () => {
      if (userDetails?.image) {
        setUserImage(
          `http://localhost:8080/${userDetails.image.replace(/\\/g, "/")}`
        );
      }
    };

    updateImageFromStorage();

    window.addEventListener("storage", updateImageFromStorage);
    return () => window.removeEventListener("storage", updateImageFromStorage);
  }, [userDetails]);

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top bg-primary"
      data-bs-theme="dark"
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="/logo_brand.png"
            alt=""
            style={{
              width: "40px",
              borderRadius: "50%",
            }}
          />
        </Link>
        <a className="nav-link text-light" href="mailto:ajogious@gmail.com">
          Contact Admin
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarScroll">
          {userLogin() && (
            <>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/add-task">
                    Add Task
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/view-tasks/${userDetails?.id || "default"}`}
                  >
                    View Tasks
                  </Link>
                </li>
              </ul>

              <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll">
                <p className="lead pt-2 text-light">Hi! {username}</p>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="User menu"
                  >
                    <img
                      src={userImage || "avata.png"}
                      alt="User"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                      }}
                    />
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className="dropdown-item text-secondary"
                        to="/dashboard"
                      >
                        User Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-secondary"
                        to={`/profile/${userDetails?.id || "default"}`}
                      >
                        User Profile
                      </Link>
                    </li>
                    {role === "ADMIN" && (
                      <>
                        <li>
                          <Link
                            className="dropdown-item text-secondary"
                            to="/admin-dashboard"
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-secondary"
                            to="/user-management"
                          >
                            See Users
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
