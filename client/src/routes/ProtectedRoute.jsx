import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../api";

export const homeFor = (role) => ({ HR: "/hr", Manager: "/manager", Employee: "/employee" }[role] || "/login");

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return children;
};

export default ProtectedRoute;
