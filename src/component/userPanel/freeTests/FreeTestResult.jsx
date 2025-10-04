import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import FreeTestFeedBack from "./FreeTestFeedBack";

const FreeTestResult = () => {
  const { selectedTest } = useContext(AuthContext);
  const [examResult, setExamResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = localStorage.getItem("examResult");

    if (storedResult) {
      const parsedResult = JSON.parse(storedResult);
      setExamResult(parsedResult);

      let previousAttempts =
        JSON.parse(localStorage.getItem("attemptHistory")) || [];
      previousAttempts = previousAttempts.filter(
        (attempt) => attempt.results && attempt.results.length > 0
      );

      const isDuplicate = previousAttempts.some(
        (attempt) => JSON.stringify(attempt) === JSON.stringify(parsedResult)
      );

      if (!isDuplicate) {
        previousAttempts.push(parsedResult);
        localStorage.setItem(
          "attemptHistory",
          JSON.stringify(previousAttempts)
        );
      }
    }
  }, []);

  if (!examResult) {
    return (
      <p className="text-center text-lg font-semibold">Loading result...</p>
    );
  }

  const totalQuestions = examResult.results.length;
  const correctAnswers = examResult.results.filter((q) => q.is_correct).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const unattemptedQuestions = 0;
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  const data = [
    { name: "No. of Correct answers", value: correctAnswers, color: "#0cae27" },
    {
      name: "No. of Incorrect answers",
      value: incorrectAnswers,
      color: "#c60c0f",
    },
    // {
    //   name: "No. of Unattempted questions",
    //   value: unattemptedQuestions,
    //   color: "#999999",
    // },
  ];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800">Detailed Exam Report</h2>
      <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col md:flex-row items-center md:items-start px-6">
        {/* Test Details */}
        <div className="w-full md:w-1/2 flex flex-col space-y-2 md:pr-8">
          <p>
            <strong>Test Name:</strong> Free Test
          </p>
          <p >
            <strong>Date:</strong> <span className="tracking-[0.2vw]">{new Date().toLocaleDateString() || "N/A"}</span> 
          </p>
          <p>
            <strong>Duration:</strong> 60 Minutes
          </p>
          <p>
            <strong>Time Taken:</strong> {examResult.time_taken || "00:44:39"}
          </p>
          <p>
            <strong>Total Questions:</strong> {totalQuestions}
          </p>
          <p className="text-green-600 font-medium">
            <strong>Correct Answers:</strong> {correctAnswers}
          </p>
          <p className="text-red-600 font-medium">
            <strong>Incorrect Answers:</strong> {incorrectAnswers}
          </p>
          {/* <p className="text-gray-500">
            <strong>Unattempted Questions:</strong> {unattemptedQuestions}
          </p> */}
          <p className="text-blue-700 font-semibold text-lg">
            <strong>Score:</strong> {examResult.marks_obtain} ({percentage} %)
          </p>
        </div>

        {/* Pie Chart Section */}
        <div className="w-full flex flex-col items-center">
          <PieChart
            width={500} // Keep desktop size unchanged
            height={300} // Keep desktop size unchanged
            className="hidden md:block" // Show only on desktop (≥ 768px)
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            <text
              x="30%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20px"
              fontWeight="bold"
              fill="#333"
            >
              {percentage} %
            </text>
          </PieChart>

          {/* Mobile PieChart (Only affects mobile) */}
          <PieChart
            width={300} // Smaller for mobile
            height={250} // Adjusted for mobile
            className="block md:hidden" // Show only on mobile (< 768px)
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80} // Reduce outer radius for smaller screens
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
            <text
              x="50%"
              y="40%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16px"
              fontWeight="bold"
              fill="#333"
            >
              {percentage} %
            </text>
          </PieChart>
        </div>
      </div>
      {/* <div className="flex justify-between w-[70vw] bg-gray-100 p-6 rounded-lg shadow-lg">
        <div className="w-1/2 pr-6 border-r border-gray-300 space-y-6">
          <h1 className="text-xl font-semibold mb-4 text-gray-700">
            Score Breakdown
          </h1>
          <p className="text-gray-600 mb-2">
            <strong>Quantitative Aptitude :</strong>{" "}
            <span className="text-blue-600 ml-[1vw]">5/10</span>
          </p>
          <p className="text-gray-600 mb-2">
            <strong>English Vocabulary :</strong>{" "}
            <span className="text-blue-600 ml-[1vw]">7/10</span>
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Technology :</strong>{" "}
            <span className="text-blue-600 ml-[1vw]">9/10</span>
          </p>
          <p className="text-gray-600">
            <strong>Reasoning :</strong>{" "}
            <span className="text-blue-600 ml-[1vw]">5/10</span>
          </p>
        </div>

        <div className="w-1/2 pl-6">
          <h1 className="text-xl font-semibold mb-4 text-gray-700">
            AI Feedback
          </h1>
          <p className="text-gray-600 mb-2">
            <strong>Quantitative Aptitude :</strong> Good effort! Keep practicing
            for faster problem-solving.
          </p>
          <p className="text-gray-600 mb-2">
            <strong>English Vocabulary :</strong> Expand your word bank for
            better comprehension skills.
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Technology :</strong> Time management is key to maximizing
            efficiency.
          </p>
          <p className="text-gray-600">
            <strong>Reasoning :</strong> Great job! Aim for accuracy with logical
            consistency.
          </p>
        </div>
      </div> */}
      <FreeTestFeedBack/>

      <div className="flex flex-wrap justify-center md:justify-around md:text-xl w-full max-w-5xl mx-auto gap-2 mt-[10vw] p-7.5 md:p-0">
        <button
          onClick={() => navigate("/userhub")}
          className="flex items-center gap-2 text-xl cursor-pointer text-white px-4 py-2 bg-gray-500 rounded-md"
        >
          <IoArrowBackCircleSharp />
          Back to user hub
        </button>

        <button
          onClick={() =>
            navigate("/freetestanswerkey", {
              state: {
                freeTestName: "Free Test",
              },
            })
          }
          className="bg-blue-500 px-4 py-2 text-white rounded-md transition flex items-center justify-center"
        >
          Answer Key
        </button>
        <button
          className="bg-teal-700 text-white px-4 py-2 rounded-md transition w-full md:w-auto flex items-center justify-center"
          onClick={() => {
            const confirmReattempt = window.confirm(
              "Do you want to re-attempt the exam?"
            );
            if (confirmReattempt) {
              localStorage.removeItem("examResult"); // Clear previous results
              navigate("/freetest"); // Redirect to the exam page
            }
          }}
        >
          Re-Attempt
        </button>

        {/* <button
          onClick={() => navigate("/compareresult")}
          className="bg-teal-700 text-white px-4 py-2 rounded-md transition w-full md:w-auto"
        >
          Compare Results
        </button> */}
        {/* <button className="bg-teal-700 text-white px-4 py-2 rounded-md transition w-full md:w-auto">
          Print
        </button> */}
      </div>
    </div>
  );
};

export default FreeTestResult;
