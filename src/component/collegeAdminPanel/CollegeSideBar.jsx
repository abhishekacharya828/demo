import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Users, FileText, LogOut } from "lucide-react";
import Logo from "../../assets/logo/WaveIQ Logo.png";
import toast from "react-hot-toast";

const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const buttonHover = {
  scale: 1.05,
  backgroundColor: "#F87171",
  color: "#ffffff",
  transition: { type: "spring", stiffness: 300 },
};

const MotionNavLink = motion(NavLink);

const CollegeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // ✅ Backend URL from .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("collegeAccess");
    const refreshToken = localStorage.getItem("collegeRefresh");

    if (!accessToken || !refreshToken) {
      toast.error("Tokens missing, logging out locally");
      localStorage.clear();
      navigate("/college_login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/college-admin/logout/`, // ✅ Using .env value
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (response.ok) {
        toast.success("Successfully Logged Out");
      } else {
        const data = await response.json();
        toast.error(data.detail || "Server logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Network error during logout");
    } finally {
      localStorage.removeItem("collegeAccess");
      localStorage.removeItem("collegeRefresh");
      localStorage.removeItem("collegeUser");
      setLoading(false);
      navigate("/college_login");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="w-64 h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 text-gray-900 shadow-2xl flex flex-col border-r border-indigo-200"
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-center backdrop-blur-md">
        <img src={Logo} alt="Logo" className="h-12 drop-shadow-xl" />
      </div>

      {/* Nav Tabs */}
      <nav className="flex-1 flex flex-col p-4 space-y-3 mt-6">
        <MotionNavLink
          to="/college/students"
          whileHover={{ scale: 1.05 }}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-3 rounded-xl font-semibold cursor-pointer transition-colors ${
              isActive
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-indigo-100 text-gray-700 hover:bg-indigo-200 hover:text-indigo-700"
            }`
          }
        >
          <Users size={22} />
          Students
        </MotionNavLink>

        <MotionNavLink
          to="/college/tests"
          whileHover={{ scale: 1.05 }}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-3 rounded-xl font-semibold cursor-pointer transition-colors ${
              isActive
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-indigo-100 text-gray-700 hover:bg-indigo-200 hover:text-indigo-700"
            }`
          }
        >
          <FileText size={22} />
          Tests
        </MotionNavLink>

        <MotionNavLink
          to="/college/add_all_questions"
          whileHover={{ scale: 1.05 }}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-3 rounded-xl font-semibold cursor-pointer transition-colors ${
              isActive
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-indigo-100 text-gray-700 hover:bg-indigo-200 hover:text-indigo-700"
            }`
          }
        >
          <Users size={22} />
          Add Questions
        </MotionNavLink>
      </nav>

      {/* Logout */}
      <div className="p-5 backdrop-blur-md">
        <motion.button
          className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl font-semibold cursor-pointer shadow-md ${
            loading ? "bg-gray-300 text-gray-600" : "text-red-600"
          }`}
          whileHover={loading ? {} : buttonHover}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          onClick={handleLogout}
          disabled={loading}
        >
          <LogOut size={22} />
          {loading ? "Logging Out..." : "Logout"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CollegeSidebar;
