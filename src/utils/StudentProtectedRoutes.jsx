import { Outlet, Navigate } from "react-router-dom";
import React from "react";

const StudentProtectedRoutes = () => {
  // replace with your actual auth check
  const access = localStorage.getItem("userAccess");

  return access ? <Outlet /> : <Navigate to="/" />;
};

export default StudentProtectedRoutes;
