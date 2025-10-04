import React from "react";
import AdminLayout from "../../layout/AdminLayout";
import AdminSideBar from "../../component/adminPanel/AdminSideBar";
import AdminSchoolManagement from "../../component/adminPanel/adminDashboard/AdminSchoolManagement";
import CollegeAdmin from "../../component/adminPanel/adminDashboard/CollegeAdmin";

const CollegeAdminPage = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen shadow-md rounded-2xl">
        <CollegeAdmin />
      </div>
    </AdminLayout>
  );
};

export default CollegeAdminPage;
