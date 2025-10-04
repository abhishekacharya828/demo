import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TestTabs from "./TestTabs";
import TestActions from "./TestActions";

// Import your tab pages
import AnalyticsPage from "./tabs/Analytics";
import SudentsPage from "./tabs/Students";
import Questions from "./tabs/Questions";
import SchedulePage from "./tabs/SchedulePage";

const TestDashboard = () => {
  return (
    <div className="p-6">
      {/* Top Tabs */}
      <TestTabs />

      {/* Search + Stats + Actions */}
      {/* <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-6">
        <TestActions />
      </div> */}

      {/* Tab Content */}
      <div className="mt-6">
        <Routes>
          {/* Default redirect: open Analytics when test is opened */}
          <Route path="/" element={<Navigate to="analytics" replace />} />

          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="students" element={<SudentsPage />} />
          <Route path="questions" element={<Questions />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default TestDashboard;
