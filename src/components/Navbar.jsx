import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ username, userIcon, handleLogout }) => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    if (username) {
      setShowWelcomeMessage(true);
    } else {
      setShowWelcomeMessage(false);
    }
  }, [username]);

  const handleLogoutClick = () => {
    if (handleLogout) handleLogout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        {/* Brand and Home Link */}
        <div className="d-flex justify-content-start align-items-center">
          {username && showWelcomeMessage && (
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
          <ul className="navbar-nav ms-auto">
            {username && showWelcomeMessage && (
              <>
                <li className="nav-item">
                  <a href="/userpage" className="nav-link">
                    Home Page
                  </a>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-danger"
                    onClick={handleLogoutClick}
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
