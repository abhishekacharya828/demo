import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExamSecurityWrapper = ({ children }) => {
  const [violationCount, setViolationCount] = useState(0);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const openFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const submitExam = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/exam/submit/`, {});
      navigate("/user_profile");
    } catch (error) {
      console.error("Failed to submit exam:", error);
      alert("Something went wrong while submitting the exam.");
      navigate("/user_profile");
    }
  };

  const handleViolation = () => {
    setViolationCount((prev) => {
      const newCount = prev + 1;
      if (newCount < 3) {
        alert(
          `⚠️ Warning ${newCount}/2: You switched tab or exited fullscreen.\nStay on the exam page or your test will be submitted!`
        );
      } else {
        alert("❌ You violated the rules 3 times. Your test will now be submitted.");
        submitExam();
      }
      return newCount;
    });
  };

  useEffect(() => {
    openFullscreen();

    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) handleViolation();
    };

    const handleContextMenu = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      const blockedKeys = ["F12", "F5", "Escape"]; // 🚫 Block Esc too
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }

      if (e.ctrlKey || e.metaKey) {
        if (
          ["r", "R", "s", "S", "p", "P", "c", "C", "v", "V", "t", "T", "Tab"].includes(
            e.key
          )
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <>{children}</>;
};

export default ExamSecurityWrapper;
