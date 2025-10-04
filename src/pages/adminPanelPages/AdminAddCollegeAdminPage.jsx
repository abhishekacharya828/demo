import React from "react";
import AdminLayout from "../../layout/AdminLayout";

import AddSchool from "../../component/adminPanel/adminDashboard/AddSchool";
import AddCollegeAdmin from "../../component/adminPanel/adminDashboard/AddCollegeAdmin";

const AdminAddCollegeAdmin = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen  shadow-md rounded-2xl">
        <AddCollegeAdmin />
      </div>
    </AdminLayout>
  );
};

export default AdminAddCollegeAdmin;
