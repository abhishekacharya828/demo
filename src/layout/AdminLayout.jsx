import React from "react";
import AdminSideBar from "../component/adminPanel/AdminSideBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar with fixed width */}
      <div className="w-64">
        <AdminSideBar />
      </div>

      {/* Main content grows and has padding */}
      <main className="flex-grow p-4 ">{children}</main>
    </div>
  );
};

export default AdminLayout;
