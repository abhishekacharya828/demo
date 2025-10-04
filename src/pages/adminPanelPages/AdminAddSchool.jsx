import React from "react";
import AdminLayout from "../../layout/AdminLayout";

import AddSchool from "../../component/adminPanel/adminDashboard/AddSchool";

const AdminAddSchool = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen shadow-md rounded-2xl">
        <AddSchool />
      </div>
    </AdminLayout>
  );
};

export default AdminAddSchool;
