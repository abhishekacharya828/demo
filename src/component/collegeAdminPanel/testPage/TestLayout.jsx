import React from "react";
import { Outlet } from "react-router-dom";
import TestTabs from "./components/TestTabs";

const TestLayout = () => {
  return (
    <div className="p-6">
      {/* Tabs Navigation */}
      <TestTabs />

      {/* Tab Content */}
      <div className="mt-6">
        <Outlet /> {/* renders the active tab page */}
      </div>
    </div>
  );
};

export default TestLayout;
