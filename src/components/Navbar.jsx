import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ username, handleLogout }) => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    if (username) {
      setShowWelcomeMessage(true);
    } else {
      setShowWelcomeMessage(false);
    }
  }, [username]);

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        {/* Brand and Home Link */}
        <div className="d-flex justify-content-start align-items-center">
          <Link className="navbar-brand" to="/userpage">
            <strong className="h2">Task Manager</strong>
          </Link>
          <Link
            className="pt-1 text-secondary"
            to="/userpage"
            style={{ textDecoration: "none" }}
          >
            Home Page
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
                  <span className="nav-link">Welcome, {username}</span>
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
