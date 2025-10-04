import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const SuperAdminProtectedRoutes = () => {
  const { isSuperAdminAuthenticated } = useContext(AuthContext);

  if (!isSuperAdminAuthenticated) {
    return <Navigate to="/admin_login" replace />;
  }
  return <Outlet />;
};

export default SuperAdminProtectedRoutes;
