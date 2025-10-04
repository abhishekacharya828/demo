import React from "react";
import { Users, Heart, CheckCircle, Star } from "lucide-react";

const stats = [
  { label: "Leads", value: "3.1K", icon: <Users size={18} /> },
  { label: "Engaged", value: "3.1K", icon: <Heart size={18} /> },
  { label: "Failed", value: "0", icon: <Star size={18} /> },
  { label: "Pending", value: "334", icon: <CheckCircle size={18} /> },
  { label: "Completed", value: "2.7K", icon: <CheckCircle size={18} /> },
];

const TestStats = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white px-4 py-2 rounded-lg shadow">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-2 text-gray-700 font-medium">
          {stat.icon}
          <span>{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default TestStats;
