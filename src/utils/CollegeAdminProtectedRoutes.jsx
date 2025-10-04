import { Outlet, Navigate } from "react-router-dom";
import React from "react";

const CollegeAdminProtectedRoutes = () => {
  // replace with your actual auth check
  const access = localStorage.getItem("collegeAccess");  

  return access ? <Outlet /> : <Navigate to="/college_login" />;
};

export default CollegeAdminProtectedRoutes;
