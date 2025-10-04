import React, { useContext } from "react";
import call from "../../../assets/userPanel/Call.png";
import email from "../../../assets/userPanel/Email.png";
import { AuthContext } from "../../../context/AuthContext";
import logo from "../../../assets/logo/WaveIQ Logo.png";
import { useLocation } from "react-router-dom";

const InstructionsHeading = () => {
  const location = useLocation();
  const freeTestLocation = location.state?.from;
  const { examTitle } = useContext(AuthContext);

  return (
    <div className="bg-[#F4F4F4] shadow-md px-[2vw] flex flex-col md:flex-row md:justify-between items-center text-center md:text-left">
      <div className="mb-2 md:w-[14vw] md:h-[8vw] w-[30vw] h-[20vw] ">
        <img
          src={logo}
          alt=""
          className="w-full h-full object-center object-contain"
        />
      </div>
      <h2 className="text-xl md:text-2xl font-bold">
        {examTitle}
      </h2>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 md:pr-[4vw] mt-4 md:mt-0">
        <div className="flex items-center space-x-2">
          <img src={call} alt="Call" className="h-5 w-5" />
          <span className="text-sm md:text-base">+91 9348229679</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src={email} alt="Email" className="h-5 w-5" />
          <span className="text-sm md:text-base">
            support@dreamwaveinnovation.com
          </span>
        </div>
      </div>
    </div>
  );
};

export default InstructionsHeading;
