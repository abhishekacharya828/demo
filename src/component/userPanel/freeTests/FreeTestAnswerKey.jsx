import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { IoIosCloudDone } from "react-icons/io";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { BiLogOut } from "react-icons/bi";

const FreeTestAnswerKey = () => {
  const { freeTestQuestions, userData, selectedTest } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [examResult, setExamResult] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get exam result from local storage
    const storedResult = localStorage.getItem("examResult");

    if (storedResult) {
      const parsedResult = JSON.parse(storedResult);
      setExamResult(parsedResult);
    }
  }, []);
  useEffect(() => {
    console.log("Questions from context:", freeTestQuestions);
  }, [freeTestQuestions]);

  const question = freeTestQuestions?.[currentIndex] || {};

  const correctAnswers =
    examResult?.results?.filter((q) => q.is_correct)?.length || 0;
  const incorrectAnswers =
    examResult?.results?.filter(
      (q) => !q.is_correct && q.selected_option !== null
    )?.length || 0;
  const notAttempted =
    examResult?.results?.filter((q) => q.selected_option === null)?.length || 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_message: reportText,
      from_name: userData.username,
      class: userData.class_or_branch,
      test: selectedTest.name,
    };

    emailjs
      .send(
        "service_gqr357a",
        "template_bzsohrw",
        templateParams,
        "cOiTMagzVAX_Js2gz"
      )
      .then(
        (response) => {
          console.log("Email sent successfully!", response);
          setReportText("");
          Swal.fire({
            title: "Success!",
            text: "Your message has been sent successfully!",
            icon: "success",
            confirmButtonColor: "#FFC107",
            confirmButtonText: "OK",
          });
        },
        (error) => {
          console.error("Error sending email:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to send the message. Please try again.",
            icon: "error",
            confirmButtonColor: "#FFC107",
            confirmButtonText: "OK",
          });
        }
      );
  };
  const nextQuestion = () => {
    if (currentIndex < freeTestQuestions.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const isCorrect = examResult?.results.find(
    (q) => q.id === question.id
  )?.is_correct;
  const result =
    examResult?.results?.find(
      (res) => res.question_id === question?.question_id
    ) || {};

  return (
    <div className="flex flex-col md:flex-row gap-4 md:min-h-[39vw] w-full overflow-y-auto scrollbar-hidden">
      {/* Exam Questions Section */}
      <div className="bg-[#F4F4F4] p-8 rounded-md shadow-lg w-full md:w-3/4 space-y-10 flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
          <span className="font-bold">Question {currentIndex + 1}</span>
          {/* <div className="flex space-x-6">
            <span>
              Marks for correct response:{" "}
              <span className="text-green-600">
                {question?.correct_marks || "N/A"}
              </span>
            </span>
            <span>
              Negative marking:{" "}
              <span className="text-red-600">
                {question?.negative_marks || "0.00"}
              </span>
            </span>
          </div> */}
        </div>
        <div className="flex space-x-4">
          <p className="mb-4">{question?.question_text}</p>
          {result?.is_correct && (
            <p className="text-green-500 font-bold">correct!</p>
          )}
          {!result?.is_correct && (
            <p className="text-red-500 font-bold">Wrong!</p>
          )}
        </div>

        {question?.image ? (
          <img
            src={question?.image}
            alt="Question"
            className="max-w-lg mx-auto mb-4 rounded-md"
          />
        ) : (
          <div className="h-[5vw] max-w-lg mx-auto text-center flex items-center justify-center px-6 mb-4 rounded-md"></div>
        )}
        <div className="space-y-2 mb-6">
          {/* Option A */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              readOnly
              checked={result?.selected_option === "a"}
              className={`
        appearance-none w-4 h-4 border-2 rounded-full 
        ${
          question.correct_option === "a" ? "border-green-500 bg-green-400" : ""
        }
        ${
          result?.selected_option === "a" && question.correct_option !== "a"
            ? "border-red-500 bg-red-500"
            : ""
        }
      `}
            />
            <span>a) {question.option_a}</span>
          </div>

          {/* Option B */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              readOnly
              checked={result?.selected_option === "b"}
              className={`
        appearance-none w-4 h-4 border-2 rounded-full 
        ${
          question.correct_option === "b" ? "border-green-500 bg-green-400" : ""
        }
        ${
          result?.selected_option === "b" && question.correct_option !== "b"
            ? "border-red-500 bg-red-500"
            : ""
        }
      `}
            />
            <span>b) {question.option_b}</span>
          </div>

          {/* Option C */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              readOnly
              checked={result?.selected_option === "c"}
              className={`
        appearance-none w-4 h-4 border-2 rounded-full 
        ${
          question.correct_option === "c" ? "border-green-500 bg-green-400" : ""
        }
        ${
          result?.selected_option === "c" && question.correct_option !== "c"
            ? "border-red-500 bg-red-500"
            : ""
        }
      `}
            />
            <span>c) {question.option_c}</span>
          </div>

          {/* Option D */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              readOnly
              checked={result?.selected_option === "d"}
              className={`
        appearance-none w-4 h-4 border-2 rounded-full 
        ${
          question.correct_option === "d" ? "border-green-500 bg-green-400" : ""
        }
        ${
          result?.selected_option === "d" && question.correct_option !== "d"
            ? "border-red-500 bg-red-500"
            : ""
        }
      `}
            />
            <span>d) {question.option_d}</span>
          </div>
        </div>

        <div>
          <h1>Explanation :-</h1>
          <p>
            {result?.description?.startsWith("https:") ? (
              <img src={result.description} alt="Description Image" />
            ) : result?.description ? (
              result.description
            ) : (
              "No description available"
            )}
          </p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-between gap-4 md:text-xl mt-4">
          <button
            className="bg-[#011b62] px-4 py-2  text-white rounded-md transition flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <BiLogOut className="text-3xl" />
          </button>
          <button
            className="bg-[#0ab2b2] px-4 py-2 text-white rounded-md transition flex items-center justify-center"
            onClick={() => navigate("/userhub")}
          >
            User Hub
          </button>
          <button
            onClick={() => setReportModalOpen(true)}
            className="bg-[#6a5adf] text-white px-4 py-2 rounded-md transition w-full md:w-auto"
          >
            Report an issue
          </button>
          <button
            className="bg-[#fc8a06] text-white px-4 py-2 rounded-md transition w-full md:w-auto"
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
        </div>
      </div>

      {/* Question Review Section */}
      <div className="bg-[#F4F4F4] p-4 rounded-md shadow-lg md:w-1/4 flex flex-col justify-between ">
        <div className="grid grid-cols-1 gap-4 mb-4 text-sm font-semibold">
          <div className="flex items-center space-x-2">
            <span className="bg-[#75f94d] w-6 h-6 flex items-center justify-center rounded text-white">
              {correctAnswers}
            </span>
            <span>Correct</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-red-500 w-6 h-6 flex items-center justify-center rounded text-white">
              {incorrectAnswers}
            </span>
            <span>Incorrect</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#b7b7b7] w-6 h-6 flex items-center justify-center rounded text-white">
              {notAttempted}
            </span>
            <span>Not Visited</span>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mb-4">
          {freeTestQuestions.map((q, i) => {
            const result = examResult?.results.find(
              (res) => res.question_id === q.question_id
            );
            return (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-sm font-semibold cursor-pointer 
                ${result?.is_correct ? "bg-[#75f94d] text-white" : ""}
                ${
                  !result?.is_correct && result?.selected_option !== null
                    ? "bg-red-500 text-white"
                    : ""
                }
                ${
                  result?.selected_option === null
                    ? "bg-[#b7b7b7] text-white"
                    : ""
                }`}
                onClick={() => setCurrentIndex(i)}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div className="space-x-2 pb-[2vw]">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className={`bg-[#009DDB] text-white px-4 py-1 rounded-md transition w-full md:w-[48%] ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentIndex === freeTestQuestions.length - 1}
            className={`bg-[#007bff] text-white px-4 py-1 rounded-md transition w-full md:w-[48%] ${
              currentIndex === freeTestQuestions.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 hover:scale-[1.02]">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4 text-center uppercase tracking-wide">
              🚨 Report an Issue
            </h2>

            {/* Test Details with New Gradient */}
            <div className="bg-gradient-to-r from-[#54f5ad] via-[#0fd286] to-[#3dabe6] shadow-lg rounded-xl p-5 text-white">
              <h3 className="text-lg font-bold text-center mb-3">
                Test Details
              </h3>
              <div className="space-y-3 text-lg">
                <p className="flex justify-between items-center">
                  <span className="font-light opacity-80">👤 Name:</span>
                  <span className="font-semibold">{userData.username}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-light opacity-80">📚 Class:</span>
                  <span className="font-semibold">
                    {userData.class_or_branch}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-light opacity-80">
                    📝 Test Appearing:
                  </span>
                  <span className="font-semibold text-yellow-300">
                    {selectedTest?.name ? selectedTest.name : "Free Test"}
                  </span>
                </p>
              </div>
            </div>

            {/* Report Input Field */}
            <textarea
              className="w-full mt-5 p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-[#0fd286] focus:outline-none resize-none bg-gray-50 placeholder-gray-500"
              rows="4"
              placeholder="✍️ Describe the issue..."
              value={reportText}
              name="reportText"
              id="reportText"
              onChange={(e) => setReportText(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-5">
              {/* Cancel Button */}
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-5 py-2 flex items-center gap-2 rounded-lg bg-gray-300 text-gray-900 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <MdCancel className="text-xl" /> Cancel
              </button>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="px-5 py-2 flex items-center gap-2 rounded-lg bg-[#0fd286] text-white shadow-md hover:bg-[#3dabe6] hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <IoIosCloudDone className="text-xl" /> Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeTestAnswerKey;
