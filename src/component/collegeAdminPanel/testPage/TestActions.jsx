import React from "react";
import { Filter, PauseCircle, Plus } from "lucide-react";

const TestActions = () => {
  return (
    <div className="flex items-center gap-3">
      <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
        <Filter size={16} />
        Filters
      </button>
      <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
        <PauseCircle size={16} />
        Pause Campaign
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
        <Plus size={16} />
        Add Leads
      </button>
    </div>
  );
};

export default TestActions;
