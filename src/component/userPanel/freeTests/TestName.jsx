import React, { useState, useEffect, useContext } from "react";
import { FaClock } from "react-icons/fa";
import call from "../../../assets/userPanel/Call.png";
import email from "../../../assets/userPanel/Email.png";
import { AuthContext } from "../../../context/AuthContext";
import logo from "../../../assets/logo/WaveIQ Logo.png";

const TestName = () => {
  const { examTitle,selectedTest, timeLeft, setTimeLeft } = useContext(AuthContext);
  const testDuration = 60 * 60 * 1000; // 1 hour in milliseconds
  const startTimeKey = "testStartTime";

  useEffect(() => {
    const resetStartTime = () => {
      const newStartTime = Date.now();
      localStorage.setItem(startTimeKey, newStartTime);
      return newStartTime;
    };
    let startTime = localStorage.getItem(startTimeKey);

    if (!startTime) {
      startTime = resetStartTime();
    } else {
      startTime = parseInt(startTime, 10);
    }

    const updateRemainingTime = () => {
      const elapsed = Date.now() - parseInt(startTime);
      const remainingTime = testDuration - elapsed;

      if (remainingTime <= 0) {
        setTimeLeft(0);
        localStorage.removeItem(startTimeKey);
        return;
      }

      setTimeLeft(remainingTime);
    };

    updateRemainingTime(); // Set initial value immediately
    const interval = setInterval(updateRemainingTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {}, [selectedTest]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours > 0 ? hours + ":" : ""}${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="bg-[#f4f4f4] px-4 py-2 flex flex-col md:flex-row md:justify-between md:items-center">
      <div className="mb-2 w-[30vw] md:w-[15vw] h-[20vw]  md:h-[3vw] flex justify-center ">
        <img
          src={logo}
          alt=""
          className="w-full h-full object-center object-contain"
        />
      </div>

      {/* Test Name */}
      <h2 className="text-xl md:text-2xl font-bold text-center md:text-left">
        {examTitle}
      </h2>

      <div className="flex flex-col items-center md:items-end space-y-3 md:pr-[4vw]">
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center md:justify-end text-gray-700 space-x-4">
          <div className="flex items-center space-x-2">
            <img src={call} alt="Call" className="h-4 w-4" />
            <span className="text-sm">+91 9348229679</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src={email} alt="Email" className="h-4 w-4" />
            <span className="text-sm">support@dreamwaveinnovation.com</span>
          </div>
        </div>

        <div className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center space-x-2">
          <FaClock />
          <span>{timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}</span>
        </div>
      </div>
    </div>
  );
};

export default TestName;
