import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="home">
      <div className="wrapper d-flex vh-100 justify-content-center align-items-center">
        <div className="box text-center col-10 col-md-8 col-lg-6">
          <h3>{getGreeting()}!</h3>
          <h1 className="mb-4">
            Welcome to A3Tech Academy Task Management System
          </h1>
          <p
            className="mb-4"
            style={{
              fontSize: "20px",
            }}
          >
            With us, your tasks are safe.
          </p>
          <div>
            <Link
              to="/register"
              className="btn btn-primary me-3"
              aria-label="Register"
            >
              <i className="bi bi-person-plus"></i> Register
            </Link>
            <Link to="/login" className="btn btn-secondary" aria-label="Login">
              <i className="bi bi-box-arrow-in-right"></i> Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
