import React from "react";
import AdminLayout from "../../layout/AdminLayout";
import EditSchool from "../../component/adminPanel/adminDashboard/EditSchool";

const AdminEditSchool = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen  shadow-md rounded-2xl">
        <EditSchool />
      </div>
    </AdminLayout>
  );
};

export default AdminEditSchool;
