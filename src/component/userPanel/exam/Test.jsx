import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("userAccess");
  const { setExamId, setExamTitle } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/get-assigned-exams/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch exams");
        const data = await res.json();
        setExams(data.assigned_exams || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading exams...</p>;
  if (!exams.length)
    return (
      <p className="text-center mt-10 text-gray-500">No exams available</p>
    );

  const storeExamId = (id , title) => {
    setExamId(id);
    setExamTitle(title)
    navigate("/user_test/instructions")
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {exams?.map((exam) => {
        const now = new Date();
        const start = new Date(exam.start_time);
        const end = new Date(exam.end_time);

        // Check if exam is currently available
        const isAvailable = now >= start && now <= end;

        return (
          <div
            key={exam.id}
            className="relative flex flex-col justify-between bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 cursor-pointer hover:scale-105"
          >
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800">{exam.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Assigned Exam</p>
            </div>

            {/* Timing */}
            <div className="flex flex-col gap-1 mb-4">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Start:</span>{" "}
                {start.toLocaleString()}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">End:</span>{" "}
                {end.toLocaleString()}
              </p>
            </div>

            {/* Action button */}
            <button
              className={`mt-auto py-2 w-full font-semibold rounded-lg transition-colors ${
                isAvailable
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
              disabled={!isAvailable}
              onClick={() => storeExamId(exam.id , exam.title)}
            >
              {isAvailable ? "Start Exam" : "Not Available"}
            </button>

            {/* Optional: Badge */}
            {/* <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
              New
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default Test;
