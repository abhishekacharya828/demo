import React from "react";
import AdminLayout from "../../layout/AdminLayout";
import AdminSideBar from "../../component/adminPanel/AdminSideBar";
import AdminSchoolManagement from "../../component/adminPanel/adminDashboard/AdminSchoolManagement";

const AdminManageSchool = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen  shadow-md rounded-2xl">
        <AdminSchoolManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminManageSchool;
