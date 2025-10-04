import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/WaveIQ Logo.png";
import { CgProfile } from "react-icons/cg";
import { FaRegAddressCard, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineLaptopMac } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import { TbLogout2 } from "react-icons/tb";
import toast from "react-hot-toast";

const SideNavBar = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { refreshtokens, tokens, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // for mobile menu toggle

  const activateBg = ({ isActive }) => {
    return {
      color: isActive && "#92278E",
    };
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("userAccess");
    const refreshToken = localStorage.getItem("userRefresh");

    if (!accessToken || !refreshToken) {
      toast.error("Missing tokens, please login again.");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }), // ✅ send refresh token too
      });

      if (response.ok) {
        toast.success("Successfully Logged Out");

        // ✅ Clear storage only on successful logout
        localStorage.removeItem("userAccess");
        localStorage.removeItem("userRefresh");
        localStorage.removeItem("user");
        localStorage.removeItem("userData");
        localStorage.removeItem("studentData");
        localStorage.removeItem("questions");
        localStorage.removeItem("selectedTest");

        navigate("/");
      } else {
        const errorData = await response.json();
        toast.error(errorData?.detail || "Failed to logout.");
      }
    } catch (error) {
      toast.error("Server error. Could not logout.");
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-8 right-4 z-50">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[65vw] bg-[#F4F4F4] z-40 p-6 transition-transform duration-300 ease-in-out rounded-r-3xl ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img src={logo} alt="logo" className="mb-8 w-24" />
        <div className="flex flex-col justify-between h-[90%]">
          <div className="flex flex-col space-y-5 text-lg font-semibold capitalize">
            <NavLink
              to="/user_profile"
              onClick={() => setMenuOpen(false)}
              style={activateBg}
            >
              <div className="flex items-center text-2xl gap-2">
                <CgProfile />
                <p className="font-semibold text-xl">Profile</p>
              </div>
            </NavLink>

            <NavLink
              to="/user_test"
              onClick={() => setMenuOpen(false)}
              style={activateBg}
            >
              <div className="flex items-center text-2xl gap-2">
                <FaRegAddressCard />
                <p className="font-semibold text-xl">UserHub</p>
              </div>
            </NavLink>

            <NavLink
              to="/settings"
              onClick={() => setMenuOpen(false)}
              style={activateBg}
            >
              <div className="flex items-center text-2xl gap-2">
                <MdOutlineLaptopMac />
                <p className="font-semibold text-xl">Settings</p>
              </div>
            </NavLink>
          </div>

          <div
            className="flex cursor-pointer text-2xl gap-2 mt-6"
            onClick={handleSubmit}
          >
            <TbLogout2 className="text-3xl" />
            <p className="font-semibold text-xl">Logout</p>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className="w-auto min-w-[17vw] md:h-[100vh] md:flex hidden bg-[#F4F4F4] md:p-6 p-2 pt-[10vw] md:pt-0 shadow-gray-500 shadow-md flex-col items-center justify-between md:items-start"
      >
        <div>
          <div className="mb-2 w-[14vw] h-[8vw]">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-center object-contain"
            />
          </div>

          <div className="space-y-6 pl-4 w-full capitalize">
            <div className="flex flex-col md:flex-row items-center">
              <NavLink style={activateBg} to="/user_profile">
                <div className="flex items-center justify-center text-xl">
                  <CgProfile />
                  <p className="hidden md:block ml-3 font-semibold">Profile</p>
                </div>
              </NavLink>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <NavLink style={activateBg} to="/user_test">
                <div className="flex items-center justify-center text-xl">
                  <FaRegAddressCard />
                  <p className="hidden md:block ml-3 font-semibold text-xl">
                    UserHub
                  </p>
                </div>
              </NavLink>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <NavLink style={activateBg} to="/settings">
                <div className="flex items-center justify-center text-xl">
                  <MdOutlineLaptopMac />
                  <p className="hidden md:block ml-3 font-semibold text-xl">
                    Settings
                  </p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>

        <div
          className="flex items-center pl-5 justify-center cursor-pointer text-3xl"
          onClick={handleSubmit}
        >
          <TbLogout2 className="text-xl" />
          <p className="hidden md:block ml-3 font-semibold text-xl">Logout</p>
        </div>
      </div>
    </>
  );
};

export default SideNavBar;
