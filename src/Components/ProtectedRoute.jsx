import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  // Get token and user from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Check if user is logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin-dashboard" replace />;
      case "accountant":
        return <Navigate to="/accountant-dashboard" replace />;
      case "student":
        return <Navigate to="/student-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If all checks pass, render the requested page
  return <Outlet />;
};

export default ProtectedRoute;
