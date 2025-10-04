import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { School } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo/WaveIQ Logo.png"; // ✅ Adjust path if needed

// Sidebar animation
const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

// Button hover animation
const buttonHover = { scale: 1.05, backgroundColor: "#FEE2E2" };

// Motion NavLink wrapper
const MotionNavLink = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-4 px-5 py-3 rounded-xl font-semibold transition-colors ${
        isActive
          ? "bg-indigo-500 text-white shadow-md"
          : "bg-indigo-100 text-gray-700 hover:bg-indigo-200 hover:text-indigo-700"
      }`
    }
  >
    {children}
  </NavLink>
);

const AdminSideBar = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { setAdminTokens, setAdminData , setIsSuperAdminAuthenticated} = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/logout/`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Successfully Logged Out");
      } else {
        toast.error("Logout failed. Clearing session.");
      }

      localStorage.removeItem("adminTokens");
      localStorage.removeItem("admin_data");
      localStorage.removeItem("isSuperAdminAuthenticated");
      setAdminTokens(null);
      setAdminData({});
      setIsSuperAdminAuthenticated(false);
      navigate("/admin_login");
    } catch (error) {
      toast.error(`Error logging out: ${error}`);
    }
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-6 right-4 z-50">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: menuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
        className="md:hidden fixed top-0 left-0 h-full w-[70vw] bg-gradient-to-b from-indigo-50 via-white to-indigo-50 text-gray-900 shadow-2xl p-6 z-40 rounded-r-2xl flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="logo" className="h-12 drop-shadow-xl" />
          </div>
          <nav className="flex flex-col space-y-4">
            <MotionNavLink to="/admin_dashboard" onClick={() => setMenuOpen(false)}>
              <School size={22} />
              Manage College
            </MotionNavLink>
            <MotionNavLink to="/college_admin" onClick={() => setMenuOpen(false)}>
              <School size={22} />
              Manage College Admin
            </MotionNavLink>
          </nav>
        </div>
        <motion.button
          whileHover={buttonHover}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-red-600 shadow-md"
        >
          <TbLogout2 size={22} />
          Logout
        </motion.button>
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className="hidden fixed top-0 left-0 md:flex w-64 h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 text-gray-900 shadow-2xl flex-col border-r border-indigo-200"
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center backdrop-blur-md">
          <img src={logo} alt="logo" className="h-12 drop-shadow-xl" />
        </div>

        {/* Nav Tabs */}
        <nav className="flex-1 flex flex-col p-4 space-y-3 mt-6">
          <MotionNavLink to="/admin_dashboard">
            <School size={22} />
            Manage College
          </MotionNavLink>
          <MotionNavLink to="/college_admin">
            <School size={22} />
            Manage College Admin
          </MotionNavLink>
        </nav>

        {/* Logout */}
        <div className="p-5 backdrop-blur-md">
          <motion.button
            className="w-full flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-red-600 shadow-md cursor-pointer"
            whileHover={buttonHover}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            <TbLogout2 size={22} />
            Logout
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default AdminSideBar;
