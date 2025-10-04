import React from "react";
import CollegeSidebar from "../component/collegeAdminPanel/CollegeSideBar";

const CollegeLayout = ({ children }) => {
  return (
    <div className="flex relative flex-row h-screen  gap-2 select-none">
    <CollegeSidebar />
      <main className="flex-grow p-6 overflow-auto bg-white">{children}</main>
    </div>
  );
};

export default CollegeLayout;
