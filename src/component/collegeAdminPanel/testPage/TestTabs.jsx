import React from "react";
import { NavLink, useParams } from "react-router-dom";

const TestTabs = () => {
  const { testName } = useParams();

  const tabs = [
    { name: "Analytics", path: "analytics" },
    { name: "Students", path: "students" },
    { name: "Questions", path: "questions" },
    { name: "Schedule", path: "schedule" },

  ];

  return (
    <div className="flex space-x-4 border-b">
      {tabs.map((tab) => (
        <NavLink
          key={tab.name}
          to={`/college/tests/${testName}/${tab.path}`}  // ✅ absolute path
          className={({ isActive }) =>
            `px-4 py-2 font-medium ${
              isActive ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"
            }`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  );
};

export default TestTabs;
