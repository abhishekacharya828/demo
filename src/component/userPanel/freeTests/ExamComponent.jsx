import React, { useContext, useEffect, useState,useRef } from "react";
// import logoutexam from "../../../assets/examPage/Logout.png";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { MdCancel } from "react-icons/md";
import { IoIosCloudDone } from "react-icons/io";
import Swal from "sweetalert2";
// import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import UseExamScreen from "../../../utils/UseExamScreen";
import CameraProctor from "./CameraProctor";
import CameraMonitor from "./CameraMonitor";

const ExamComponent = () => {
  UseExamScreen();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("userAccess");
  const {
    freeTestQuestions,
    setFreeTestQuestions,
    studentData,
    tokens,
    timeLeft,
    setTimeLeft,
    examId,
  } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [markForReview, setMarkForReview] = useState([]);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reportText, setReportText] = useState("");
  // const [questions, setQuestions] = useState([]);
  const { userData, selectedTest } = useContext(AuthContext);
  const [role_id, setRoleId] = useState(0);
  const [showBackModal, setShowBackModel] = useState(false);
  const [autoSubmitExam, setAutoSubmitExam] = useState(false);
  const location = useLocation();
  const { type } = location.state || {};

  const [examOver, setExamOver] = useState(false);
  const [techQuestions, setTechQuestions] = useState([]);
  const [nonTechQuestions, setNonTechQuestions] = useState([]);
  const [violationCount, setViolationCount] = useState(0);

  useEffect(() => {
    if (violationCount >= 3) {
      submitExam(true); // auto-submit exam
    }
  }, [violationCount]);

  const cameraRef = useRef(null);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours > 0 ? hours + ":" : ""}${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (formatTime(timeLeft) === "00:00") {
      setAutoSubmitExam(true);
    }
  }, [timeLeft]);

  // useEffect(() => {
  //   if (autoSubmitExam) {
  //     submitExam();
  //   }
  // }, [autoSubmitExam]);

  // Fetching Questions Function
  const fetchQuestions = async () => {
    try {
      const apiUrl = `${backendUrl}/api/user/exam/start/`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exam_id: examId }),
      });

      const data = await response.json();

      // TECH QUESTIONS
      const techQs = Array.isArray(data?.questions?.tech)
        ? data.questions.tech.map((q) => ({ ...q, exam_type: "tech" }))
        : [];

      // NON-TECH QUESTIONS
      const nonTechObj = data?.questions?.nontech || {};
      let nonTechQs = [];
      for (let category in nonTechObj) {
        if (Array.isArray(nonTechObj[category])) {
          nonTechQs.push(
            ...nonTechObj[category].map((q) => ({
              ...q,
              exam_type: "nontech",
              category,
            }))
          );
        }
      }

      // Set state
      setNonTechQuestions(nonTechQs); // Show first
      setTechQuestions(techQs);
      setFreeTestQuestions([...nonTechQs, ...techQs]); // Combine for navigation
    } catch (err) {
      console.error("Failed to load questions", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [navigate, token]);

  const handleOptionSelect = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => {
      const existingIndex = prevAnswers.findIndex(
        (answer) => answer.question_id === questionId
      );

      let updatedAnswers;

      if (existingIndex !== -1) {
        // Update existing answer
        updatedAnswers = prevAnswers.map((ans, index) =>
          index === existingIndex
            ? { question_id: questionId, selected_option: selectedOption }
            : ans
        );
      } else {
        // Add a new answer entry
        updatedAnswers = [
          ...prevAnswers,
          { question_id: questionId, selected_option: selectedOption },
        ];
      }

      return updatedAnswers;
    });
  };

  // Submitting Exam Function
  const submitExam = async (isAutoSubmit = false) => {
    try {
      const apiUrl = `${backendUrl}/api/user/exam/submit/`;

      // ✅ Build grouped answers
      const groupedAnswers = {
        tech: [],
        nontech: [],
      };

      freeTestQuestions.forEach((question) => {
        const existingAnswer = answers.find(
          (ans) => ans.question_id === question.question_id
        );

        const finalAnswer = existingAnswer
          ? existingAnswer
          : { question_id: question.question_id, selected_option: "skipped" };

        if (question.exam_type === "tech") {
          groupedAnswers.tech.push(finalAnswer);
        } else if (question.exam_type === "nontech") {
          groupedAnswers.nontech.push(finalAnswer);
        }
      });

      const payload = {
        exam_id: examId,
        answers: groupedAnswers,
      };

      console.log("Submitting Payload:", payload);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `❌ Failed to submit answers! Server responded with: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      // ✅ Save result in localStorage
      localStorage.setItem("examResult", JSON.stringify(result));
      localStorage.removeItem("testStartTime");

      // ✅ Mark exam as over
      setExamOver(true);
      setShowModal(true);

      // ✅ Stop camera after submission
      cameraRef.current?.stopCamera();

      toast.success("✅ Exam submitted successfully!");
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("❌ Something went wrong! Please try again.");
    }
  };

  const saveAndNextQuestion = (questionId) => {
    const selectedAnswer = answers.find(
      (ans) => ans.question_id === questionId
    );
    if (!selectedAnswer) {
      toast.error("Please select an option before proceeding !!");
      return;
    }
    setSavedAnswers((prev) =>
      prev.includes(questionId) ? prev : [...prev, questionId]
    );

    setSkippedQuestions((prev) => prev.filter((id) => id !== questionId));
    setMarkForReview((prev) => prev.filter((id) => id !== questionId));

    if (currentIndex < freeTestQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < freeTestQuestions.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (freeTestQuestions.length === 0) return <p>No questions available.</p>;

  const question = freeTestQuestions[currentIndex];
  const selectedOption = answers[question?.id] || "";

  const skipQuestion = () => {
    const currentQuestionId = freeTestQuestions[currentIndex].question_id;

    // Add question to skippedQuestions if not already included
    setSkippedQuestions((prev) =>
      prev.includes(currentQuestionId) ? prev : [...prev, currentQuestionId]
    );

    // Ensure the skipped question is recorded in answers with a "skipped" value
    setAnswers((prevAnswers) => {
      const existingIndex = prevAnswers.findIndex(
        (answer) => answer.question_id === currentQuestionId
      );
      setMarkForReview((prev) => prev.filter((id) => id !== currentQuestionId));

      let updatedAnswers;

      if (existingIndex !== -1) {
        // If question already exists, update it as skipped
        updatedAnswers = prevAnswers.map((ans, index) =>
          index === existingIndex
            ? { question_id: currentQuestionId, selected_option: "skipped" }
            : ans
        );
      } else {
        // Otherwise, add a new entry marking it as skipped
        updatedAnswers = [
          ...prevAnswers,
          { question_id: currentQuestionId, selected_option: "skipped" },
        ];
      }

      return updatedAnswers;
    });

    // Move to the next question
    if (currentIndex < freeTestQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const markForReviews = () => {
    const currentQuestionId = freeTestQuestions[currentIndex].question_id;

    // Add to markForReview if not already included
    setMarkForReview((prev) =>
      prev.includes(currentQuestionId) ? prev : [...prev, currentQuestionId]
    );

    // Remove from skippedQuestions if it was previously skipped
    setSkippedQuestions((prev) =>
      prev.filter((id) => id !== currentQuestionId)
    );

    // Ensure the marked question is recorded in answers
    setAnswers((prevAnswers) => {
      const existingIndex = prevAnswers.findIndex(
        (answer) => answer.question_id === currentQuestionId
      );

      let updatedAnswers;

      if (existingIndex !== -1) {
        // If already answered, keep the selected option
        updatedAnswers = prevAnswers.map((ans, index) =>
          index === existingIndex ? { ...ans, selected_option: "review" } : ans
        );
      } else {
        // If not answered yet, mark it as "review"
        updatedAnswers = [
          ...prevAnswers,
          { question_id: currentQuestionId, selected_option: "review" },
        ];
      }

      return updatedAnswers;
    });

    // Move to the next question
    if (currentIndex < freeTestQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const navigateUserHub = () => {
    // Stop camera when user exits manually
    cameraRef.current?.stopCamera();
    localStorage.removeItem("testStartTime");
    navigate("/user_test");
  };
  const clearResponse = (questionId) => {
    setAnswers((prevAnswers) =>
      prevAnswers.filter((ans) => ans.question_id !== questionId)
    );

    setSavedAnswers((prev) => prev.filter((id) => id !== questionId));
    setSkippedQuestions((prev) => prev.filter((id) => id !== questionId));
    setMarkForReview((prev) => prev.filter((id) => id !== questionId));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const templateParams = {
  //     from_message: reportText,
  //     from_name: userData.username,
  //     class: userData.class_or_branch,

  //   };

  //   emailjs
  //     .send(
  //       "service_gqr357a",
  //       "template_bzsohrw",
  //       templateParams,
  //       "cOiTMagzVAX_Js2gz"
  //     )
  //     .then(
  //       (response) => {
  //         console.log("Email sent successfully!", response);
  //         setReportText("");
  //         Swal.fire({
  //           title: "Success!",
  //           text: "Your message has been sent successfully!",
  //           icon: "success",
  //           confirmButtonColor: "#FFC107",
  //           confirmButtonText: "OK",
  //         });
  //       },
  //       (error) => {
  //         console.error("Error sending email:", error);
  //         Swal.fire({
  //           title: "Error!",
  //           text: "Failed to send the message. Please try again.",
  //           icon: "error",
  //           confirmButtonColor: "#FFC107",
  //           confirmButtonText: "OK",
  //         });
  //       }
  //     );
  // };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* 👀 Camera Monitor Component */}
        <div className=" top-2 right-2 z-50 shadow-lg  border rounded-md bg-black">
          <CameraMonitor ref={cameraRef} attemptId={examId} token={token} />
        </div>
        {/* Exam Questions Section */}
        <div className="bg-[#F4F4F4] px-4 py-2  rounded-md shadow-lg w-full md:w-3/4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b-3 border-white pb-2 mb-4">
            <span className="font-bold">Question {currentIndex + 1}</span>
            <div className="flex flex-col space-x-6 rounded-xl bg-white px-4 py-1 font-semibold">
              <span>Marks for</span>
              <span>
                Correct response :{" "}
                <span className="text-green-600">
                  {question?.correct_marks || "1"}
                </span>
              </span>
              <span>
                Incorrect response :{" "}
                <span className="text-red-600">
                  {question?.negative_marks || "0"}
                </span>
              </span>
            </div>
          </div>
          <p className="mb-2 text-xl">{question?.question_text}</p>
          <div className="h-full overflow-y-scroll scrollbar-hidden my-[2vw]">
            {question?.image ? (
              <img
                src={question?.image}
                alt="Question"
                className="max-w-lg mx-auto mb-4 rounded-md"
              />
            ) : null}
            <div className="space-y-2 flex-grow mt-[3vw]">
              <label className="flex items-center space-x-2 cursor-pointer w-fit">
                <input
                  type="radio"
                  name={`answer-${question?.question_id}`}
                  value={question?.option_a}
                  checked={answers.some(
                    (ans) =>
                      ans.question_id === question?.question_id &&
                      ans.selected_option === "a"
                  )}
                  onChange={() =>
                    handleOptionSelect(question?.question_id, "a")
                  }
                />
                {question?.option_a.startsWith("http") ? (
                  <img src={question?.option_a} alt="" />
                ) : (
                  <span>A) {question?.option_a}</span>
                )}
              </label>

              <label className="flex items-center space-x-2 cursor-pointer w-fit">
                <input
                  type="radio"
                  name={`answer-${question?.question_id}`}
                  value={question?.option_b}
                  checked={answers.some(
                    (ans) =>
                      ans.question_id === question?.question_id &&
                      ans.selected_option === "b"
                  )}
                  onChange={() =>
                    handleOptionSelect(question?.question_id, "b")
                  }
                />
                {question?.option_b.startsWith("http") ? (
                  <img src={question?.option_b} alt="" />
                ) : (
                  <span>B) {question?.option_b}</span>
                )}
              </label>

              <label className="flex items-center space-x-2 cursor-pointer w-fit">
                <input
                  type="radio"
                  name={`answer-${question?.question_id}`}
                  value={question?.option_c}
                  checked={answers.some(
                    (ans) =>
                      ans.question_id === question?.question_id &&
                      ans.selected_option === "c"
                  )}
                  onChange={() =>
                    handleOptionSelect(question?.question_id, "c")
                  }
                />
                {question?.option_c.startsWith("http") ? (
                  <img src={question?.option_c} alt="" />
                ) : (
                  <span>C) {question?.option_c}</span>
                )}
              </label>

              <label className="flex items-center space-x-2 cursor-pointer w-fit">
                <input
                  type="radio"
                  name={`answer-${question?.question_id}`}
                  value={question?.option_d}
                  checked={answers.some(
                    (ans) =>
                      ans.question_id === question?.question_id &&
                      ans.selected_option === "d"
                  )}
                  onChange={() =>
                    handleOptionSelect(question?.question_id, "d")
                  }
                />
                {question?.option_d.startsWith("http") ? (
                  <img src={question?.option_d} alt="" />
                ) : (
                  <span>D) {question?.option_d}</span>
                )}
              </label>
            </div>
          </div>
          {/* <CameraProctor /> */}

          <div className="flex flex-wrap flex-col-reverse md:flex-row justify-center md:justify-between  gap-4 md:text-xl mt-[2vw] md:mt-0">
            <button
              onClick={() => setShowBackModel(true)}
              className="bg-[#001b61] px-4 py-2 text-white rounded-md transition flex items-center justify-center"
            >
              Exit
            </button>
            {/* <button
              onClick={() => setReportModalOpen(true)}
              className="bg-[#7c7c7c] text-white px-4 py-2 rounded-md transition w-full md:w-auto"
            >
              Report an issue
            </button> */}
            <button
              onClick={() => clearResponse(question?.question_id)}
              className="bg-[#7c7c7c] text-white px-4 py-2 rounded-md transition w-full md:w-auto"
            >
              Clear Response
            </button>
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className={`bg-[#5590ff] text-white px-4 py-2 rounded-md transition w-full md:w-auto ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous Question
            </button>
            {/* <button
              onClick={nextQuestion}
              disabled={currentIndex === freeTestQuestions.length - 1}
              className={`bg-[#00bcd4] text-white px-4 py-2 rounded-md transition w-full md:w-auto ${
                currentIndex === freeTestQuestions.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next Question
            </button> */}

            <button
              className="bg-[#1aa30e] text-white py-2 px-4 rounded-md"
              onClick={() => saveAndNextQuestion(question?.question_id)}
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* Question Review Section */}
        <div className="bg-[#f4f4f4] px-4 py-2 rounded-md shadow-lg md:w-1/4 flex flex-col">
          {/* Status Counts */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm font-semibold">
            <div className="flex items-center space-x-2">
              <span className="bg-[#1aa30e] w-6 h-6 flex items-center justify-center rounded text-white">
                {savedAnswers.length}
              </span>
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#ff4346] w-6 h-6 flex items-center justify-center rounded text-white">
                {skippedQuestions?.length}
              </span>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#7c7c7c] w-6 h-6 flex items-center justify-center rounded text-white">
                {freeTestQuestions.length -
                  (savedAnswers.length +
                    skippedQuestions.length +
                    markForReview.length)}
              </span>
              <span>Not Visited</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#8c25a3] w-6 h-6 flex items-center justify-center rounded text-white">
                {markForReview.length}
              </span>
              <span>Marked for Review</span>
            </div>
          </div>

          <div className="border-b border-white border-2 mb-2"></div>

          {/* Scrollable Questions Section */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 space-y-4">
            {/* Tech Questions */}
            <div>
              <h3 className="font-bold mb-2 text-sm">Non-Tech Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {nonTechQuestions.map((q, i) => (
                  <div
                    key={q.question_id}
                    className={`w-8 h-8 flex items-center justify-center rounded-sm font-semibold cursor-pointer 
      ${savedAnswers.includes(q.question_id) ? "bg-[#1aa30e] text-white" : ""}
      ${
        skippedQuestions.includes(q.question_id)
          ? "bg-[#ff4346] text-white"
          : ""
      }
      ${markForReview.includes(q.question_id) ? "bg-[#8c25a3] text-white" : ""}
      ${
        !savedAnswers.includes(q.question_id) &&
        !skippedQuestions.includes(q.question_id)
          ? "bg-[#7c7c7c] text-white"
          : ""
      }`}
                    onClick={() =>
                      setCurrentIndex(
                        freeTestQuestions.findIndex(
                          (fq) => fq.question_id === q.question_id
                        )
                      )
                    }
                  >
                    {i + 1} {/* Non-tech numbering */}
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Tech Questions */}
            <div>
              <h3 className="font-bold mb-2 text-sm">Tech Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {techQuestions.map((q, i) => (
                  <div
                    key={q.question_id}
                    className={`w-8 h-8 flex items-center justify-center rounded-sm font-semibold cursor-pointer 
      ${savedAnswers.includes(q.question_id) ? "bg-[#1aa30e] text-white" : ""}
      ${
        skippedQuestions.includes(q.question_id)
          ? "bg-[#ff4346] text-white"
          : ""
      }
      ${markForReview.includes(q.question_id) ? "bg-[#8c25a3] text-white" : ""}
      ${
        !savedAnswers.includes(q.question_id) &&
        !skippedQuestions.includes(q.question_id)
          ? "bg-[#7c7c7c] text-white"
          : ""
      }`}
                    onClick={() =>
                      setCurrentIndex(
                        freeTestQuestions.findIndex(
                          (fq) => fq.question_id === q.question_id
                        )
                      )
                    }
                  >
                    {nonTechQuestions.length + i + 1}{" "}
                    {/* Tech numbering continues */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons Fixed at Bottom */}
          <div className="mt-2 space-y-2">
            {currentIndex === freeTestQuestions.length - 1 ? (
              <div className="space-y-2">
                <div className="border-b border-white border-2"></div>
                <button
                  className="bg-blue-500 text-white py-2 px-2 rounded-md w-full"
                  onClick={submitExam}
                >
                  Submit
                </button>
                <div className="flex gap-2 w-full">
                  <button
                    className="bg-[#ff4346] text-white py-2 px-4 rounded-md flex-1"
                    onClick={skipQuestion}
                  >
                    Skip
                  </button>
                  <button
                    className="bg-[#8c25a3] text-white py-2 px-4 rounded-md flex-1"
                    onClick={markForReviews}
                  >
                    Mark for Review & Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  className="bg-[#ff4346] text-white  rounded-md flex-1"
                  onClick={skipQuestion}
                >
                  Skip
                </button>
                <button
                  className="bg-[#8c25a3] text-white rounded-md flex-1"
                  onClick={markForReviews}
                >
                  Mark for Review & Next
                </button>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-70 backdrop-blur-sm z-10 ">
            <div className="bg-white p-6 rounded-lg shadow-lg md:w-[30vw] ">
              <h2 className="text-xl font-semibold">
                Exam Submitted Successfully!
              </h2>
              {/* <p className="mt-2">Do you want to check your score?</p> */}
              <div className="mt-4 flex justify-between gap-0.5">
                {/* <button
                  className="bg-blue-500 text-white px-2 py-2 rounded-md w-[40%]"
                  onClick={() => navigate("/freetestresult")}
                >
                  Yes, Check Score
                </button> */}
                <button
                  className="bg-red-600 text-white px-2 py-2 rounded-md w-[40%]"
                  onClick={() => navigate("/user_test", { replace: true })}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
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
                    <span className="font-semibold">
                      {studentData.full_name}
                    </span>
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
        {showBackModal && (
          <div className="fixed inset-0 flex items-center justify-center shadow-lg bg-opacity-40">
            <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg flex flex-col items-center h-auto">
              <p className="mt-2 text-gray-800 font-semibold text-center">
                Do you want to exit the test and go back to the Main Menu?
              </p>
              <div className="mt-4 flex justify-around w-full">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-[40%]"
                  onClick={navigateUserHub}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 w-[40%]"
                  onClick={() => setShowBackModel(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExamComponent;
