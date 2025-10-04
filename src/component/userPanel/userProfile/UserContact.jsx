import React, { useContext } from "react";
import logout from "../../../assets/userPanel/Logout.png";
import notification from "../../../assets/userPanel/Notification.png";
import call from "../../../assets/userPanel/Call.png";
import email from "../../../assets/userPanel/Email.png";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo/WaveIQ Logo.png";

const UserContact = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { refreshtokens, tokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens} `,
        },
        body: JSON.stringify({
          refresh_token: refreshtokens,
        }),
      });

      if (response.ok) {
        alert("Successfully Logged Out");
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error updating details:", error);
    }
  };

  return (
    <div className="w-full px-4 py-3">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Logo */}
        <div className="flex justify-start md:justify-center items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-[20vw] md:h-[5vw] w-auto object-contain md:hidden"
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row items-end md:items-center text-gray-800 gap-2 md:gap-6 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <img src={call} alt="Phone" className="h-5 w-5" />
            <span>+91 9348229679</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={email} alt="Email" className="h-5 w-5" />
            <span>support@dreamwaveinnovation.com</span>
          </div>
           <img src={notification} alt="Notification" className="w-5 h-5" />
        </div>

        
        
       
       
      </div>
    </div>
  );
};

export default UserContact;
