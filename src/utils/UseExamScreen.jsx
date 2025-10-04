import { useEffect, useState } from "react";

const useExamScreen = () => {
  const [violationCount, setViolationCount] = useState(0);

  useEffect(() => {
    // Enter fullscreen
    const enterFullscreen = () => {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    };

    // Handle fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setViolationCount((prev) => {
          const newCount = prev + 1;
          alert(
            `⚠️ Fullscreen exit detected! Violation ${newCount}. Please stay in fullscreen.`
          );
          enterFullscreen();
          return newCount;
        });
      }
    };

    // Prevent F5 / Ctrl+R
    const handleKeys = (e) => {
      if (e.key === "F5" || (e.ctrlKey && e.key.toLowerCase() === "r")) {
        e.preventDefault();
      }
      // Optional: Prevent Ctrl+W (close tab)
      if (e.ctrlKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
      }
    };

    // Prevent right-click
    const handleRightClick = (e) => e.preventDefault();

    // Detect tab/window switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert(
          "Switching tabs or minimizing the window is not allowed during the exam!"
        );
        enterFullscreen();
      }
    };

    // Prevent leaving page
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    // Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      alert("Back navigation is disabled during the exam!");
    };

    // Add event listeners
    enterFullscreen();
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeys);
    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeys);
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
};

export default useExamScreen;
