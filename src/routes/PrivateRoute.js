import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ permissionLevel }) => {
  const { user, loading } = useSelector((state) => state.user);

  // Wait for token-based auth restore on refresh.
  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permissionLevel === "customer") {
    return user.lvl === "customer" ? <Outlet /> : <Navigate to="/" replace />;
  }

  if (permissionLevel === "admin") {
    return user.lvl === "admin" ? <Outlet /> : <Navigate to="/" replace />;
  }

  if (permissionLevel === "seller") {
    return user.lvl === "seller" ? <Outlet /> : <Navigate to="/" replace />;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
