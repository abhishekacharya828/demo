// src/CameraMonitor.jsx
import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Webcam from "react-webcam";
import { FaceMesh, FACEMESH_FACE_OVAL, FACEMESH_LEFT_EYE, FACEMESH_RIGHT_EYE } from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";

const CameraMonitor = forwardRef(({ attemptId, token }, ref) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hasPermission, setHasPermission] = useState(null);

  const HEAD_TURN_THRESHOLD = 0.15; // head-gaze deviation threshold

  // ✅ Use env backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const VIOLATION_API = `${backendUrl}/api/user/exam/${attemptId}/log-event/`;

  // track last sent violation to avoid spamming API
  const lastViolationRef = useRef(null);

  const sendViolation = async (event_type) => {
    if (lastViolationRef.current === event_type) return; // avoid duplicates
    lastViolationRef.current = event_type;

    try {
      await fetch(VIOLATION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ event_type }),
      });
      console.log("Violation sent:", event_type);
    } catch (err) {
      console.error("Failed to send violation:", err);
    }

    // reset lastViolation after 3 seconds to allow sending again
    setTimeout(() => {
      lastViolationRef.current = null;
    }, 3000);
  };

  const drawFaceOutline = (ctx, landmarks) => {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    FACEMESH_FACE_OVAL.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      if (!start || !end) return;
      ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height);
      ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height);
    });
    ctx.stroke();
  };

  const checkHeadGaze = (landmarks) => {
    if (!landmarks) return false;
    const leftEyeX =
      FACEMESH_LEFT_EYE.map((i) => landmarks[i]?.x || 0).reduce((a, b) => a + b, 0) /
      FACEMESH_LEFT_EYE.length;
    const rightEyeX =
      FACEMESH_RIGHT_EYE.map((i) => landmarks[i]?.x || 0).reduce((a, b) => a + b, 0) /
      FACEMESH_RIGHT_EYE.length;
    const faceCenterX = (leftEyeX + rightEyeX) / 2;
    return faceCenterX < 0.5 - HEAD_TURN_THRESHOLD || faceCenterX > 0.5 + HEAD_TURN_THRESHOLD;
  };

  const onResults = (results) => {
    const video = webcamRef.current?.video;
    if (!video) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const faces = results.multiFaceLandmarks || [];
    if (faces.length > 0) drawFaceOutline(ctx, faces[0]);

    // Violation checks
    if (faces.length === 0) {
      sendViolation("FACE_NOT_VISIBLE");
    } else if (faces.length > 1) {
      sendViolation("MULTIPLE_FACES");
    } else if (checkHeadGaze(faces[0])) {
      sendViolation("LOOKING_AWAY");
    }
  };

  const initCamera = async () => {
    try {
      if (webcamRef.current?.video?.srcObject) {
        webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      webcamRef.current.video.srcObject = stream;

      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 2,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults(onResults);

      cameraRef.current = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => await faceMesh.send({ image: webcamRef.current.video }),
        width: 320,
        height: 240,
      });
      cameraRef.current.start();
    } catch (err) {
      console.error("Camera access denied", err);
      setHasPermission(false);
      setTimeout(() => initCamera(), 500);
    }
  };

  useEffect(() => {
    initCamera();
  }, []);

  useImperativeHandle(ref, () => ({
    stopCamera: () => {
      if (webcamRef.current?.video?.srcObject) {
        webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (cameraRef.current) cameraRef.current.stop();
    },
  }));

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;
    const canvasWidth = 320;
    const canvasHeight = 240;
    const maxX = window.innerWidth - canvasWidth;
    const maxY = window.innerHeight - canvasHeight;
    setPosition({
      x: Math.min(Math.max(newX, 0), maxX),
      y: Math.min(Math.max(newY, 0), maxY),
    });
  };
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white">
        <p>Camera access is required. Please allow camera access and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      <Webcam ref={webcamRef} style={{ display: "none" }} />
      <div
        className="absolute cursor-move pointer-events-auto shadow-lg rounded-lg overflow-hidden border border-gray-600"
        onMouseDown={handleMouseDown}
        style={{
          left: position.x,
          top: position.y,
          width: 100,
          height: 80,
          userSelect: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", backgroundColor: "black" }}
        />
      </div>
    </div>
  );
});

export default CameraMonitor;
