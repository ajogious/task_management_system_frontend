import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  const userDetails = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails"))
    : null;
  const userRole = userDetails?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Checking if the role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
