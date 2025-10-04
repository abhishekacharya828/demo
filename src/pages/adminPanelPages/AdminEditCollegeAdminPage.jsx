import React from "react";
import AdminLayout from "../../layout/AdminLayout";
import EditCollegeAdmin from "../../component/adminPanel/adminDashboard/EditCollegeAdmin";

const AdminEditCollegeAdminPage = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen  shadow-md rounded-2xl">
       <EditCollegeAdmin />
      </div>
    </AdminLayout>
  );
};

export default AdminEditCollegeAdminPage;
