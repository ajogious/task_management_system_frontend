import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ username, userIcon, handleLogout }) => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(!!username);

  useEffect(() => {
    setShowWelcomeMessage(!!username);
  }, [username]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        {/* Brand and Home Link */}
        <div className="d-flex align-items-center">
          {showWelcomeMessage && userIcon && (
            <div
              className="image-avatar me-2"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid grey",
              }}
            >
              {/* Display the user's avatar */}
              <img
                src={`http://localhost:8080${userIcon}`}
                alt="User Avatar"
                className="img-fluid"
              />
            </div>
          )}
          <Link className="navbar-brand" to="/userpage">
            <strong className="h2">Task Manager</strong>
          </Link>
        </div>

        {/* Navbar Toggler for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {showWelcomeMessage && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/userpage" className="nav-link">
                  Home Page
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
