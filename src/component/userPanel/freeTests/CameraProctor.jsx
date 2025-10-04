import React, { useEffect, useRef, useState } from "react";

const CameraProctor = ({ disable }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const boxRef = useRef(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("❌ Please allow camera access to continue the exam!");
      }
    };

    if (!disable) enableCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [disable]);

  // Dragging logic
  useEffect(() => {
    const box = boxRef.current;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
      offsetX = e.clientX - box.offsetLeft;
      offsetY = e.clientY - box.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    box.addEventListener("mousedown", onMouseDown);

    return () => {
      box.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      style={{ top: position.y, left: position.x }}
      className="absolute w-48 h-36 border rounded-lg shadow-lg overflow-hidden bg-white z-50 cursor-move"
    >
      {!disable ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-600">
          Camera Off
        </div>
      )}
    </div>
  );
};

export default CameraProctor;
