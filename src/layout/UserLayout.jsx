import React from "react";
import SideNavBar from "../component/userPanel/SideNavBar";

const UserLayout = ({ children }) => {
  return (
    <div className="flex relative flex-row h-[100vh] bg-[#F4F4F4] gap-2 select-none">
      <SideNavBar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default UserLayout;
