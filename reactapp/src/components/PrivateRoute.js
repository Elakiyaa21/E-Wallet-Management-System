import React from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../utils/api";

export default function PrivateRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role && storedRole !== role) return <Navigate to="/" replace />;

  return children;
}
