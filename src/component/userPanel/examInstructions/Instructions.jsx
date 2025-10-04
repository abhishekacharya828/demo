import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoArrowBackCircleSharp } from "react-icons/io5";

const Instructions = () => {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="bg-[#F4F4F4] overflow-hidden">
      <button
        onClick={() => navigate("/user_test", { replace: true })}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full 
             bg-blue-600 text-white font-medium text-lg 
             shadow-md hover:bg-blue-700 hover:shadow-lg 
             transition-transform transform hover:scale-105"
      >
        <IoArrowBackCircleSharp className="w-6 h-6" />
        Back
      </button>

      <div className="flex flex-col justify-center items-center  p-2 ">
        <div className="md:h-[26.7vw] h-[150vw] w-[90%] bg-[#e1e1e1] p-8 rounded-lg shadow-md overflow-y-auto">
          <h1 className="text-2xl font-bold text-center mb-4">Instructions</h1>

          <h2 className="text-xl font-semibold mb-2">General Instructions:</h2>
          <p className="ml-[1vw] mb-2">
            1. The Question Palette displayed on the right side of the screen
            will show the status of each question using the following symbols:
          </p>
          <div className="flex items-center mt-2 ml-[2vw] mb-2">
            <span className="bg-gray-300 text-black px-2 py-1 rounded-xl mr-2">
              40
            </span>
            You have not visited the question yet.
          </div>
          <div className="flex items-center mt-2 ml-[2vw] mb-2">
            <span className="bg-green-500 text-white px-3 py-1 rounded-xl mr-2">
              5
            </span>
            You have answered the question.
          </div>
          <div className="flex items-center mt-2 ml-[2vw] mb-2">
            <span className="bg-red-500 text-white px-3 py-1 rounded-xl mr-2">
              3
            </span>
            You have not answered the question.
          </div>
          <div className="flex items-center mt-2 ml-[2vw] mb-2">
            <span className="bg-purple-500 text-white px-3 py-1 rounded-xl mr-2">
              9
            </span>
            You have marked the question for review.
          </div>
          <p className="ml-[1vw] mb-2">
            2. The Marked for Review status for a question simply indicates that
            you like to look at that question again.
            <span className="text-red-600 font-semibold">
              If a question is answered and Marked for Review, your answer for
              that question will be considered in the evaluation.
            </span>
          </p>

          <div className="mt-4 mb-2">
            <h2 className="text-xl font-semibold mb-2">
              Navigating to a Question:
            </h2>
            <p className="ml-[1vw] mb-2">
              3. To answer a question, do the following:
            </p>
            <div className="ml-[2vw] mb-2">
              a. Click on the question number in the Question Palette to go to
              that numbered question directly.
            </div>
            <div className="ml-[2vw] mb-2">
              b. Click <strong>Save & Next</strong> to save your answer and move
              to the next question.
            </div>
            <div className="ml-[2vw] mb-2">
              c. Click <strong>Mark for Review & Next</strong> to save your
              answer, mark it for review, and move to the next question.
            </div>
            <div className="ml-[2vw] mb-2">
              d. Caution: Note that your answer for the current question will
              not be saved if you navigate to another question directly by
              clicking on its question number.
            </div>
          </div>

          <div className="mt-4 mb-2">
            <h2 className="text-xl font-semibold mb-2">
              Answering a Question:
            </h2>
            <p className="ml-[1vw] mb-2">
              4. Procedure for answering a multiple-choice type question:
            </p>
            <div className="ml-[2vw] mb-2">
              a. To select an answer, click on the button of one of the options.
            </div>
            <div className="ml-[2vw] mb-2">
              b. To deselect an answer, click on the button of the selected
              option again or click <strong>Clear Response</strong>.
            </div>
            <div className="ml-[2vw] mb-2">
              c. To change an answer, click on another option.
            </div>
            <div className="ml-[2vw] mb-2">
              d. To save your answer, you <strong>MUST</strong> click{" "}
              <strong>Save & Next</strong>.
            </div>
            <div className="ml-[2vw] mb-2">
              e. To mark a question for review, click{" "}
              <strong>Mark for Review & Next</strong>.
            </div>
            <div className="ml-[2vw] mb-2">
              f. If an answer is selected for a question marked for review, it
              will be considered in the evaluation even if it is not marked as
              'Save & Next' at final submission.
            </div>
            <div className="ml-[1vw] mb-2">
              5. To change an answer that has already been submitted, select the
              question and follow the answering procedure.
            </div>
            <div className="ml-[1vw] mb-2">
              6. All answered or marked-for-review questions will be considered
              for evaluation.
            </div>
          </div>

          <div className="mt-4 mb-2">
            <h2 className="text-xl font-semibold mb-2">
              Additional Information:
            </h2>
            <div className="ml-[1vw] mb-2">
              7. <strong>Important: Full Screen Mode:</strong> The exam will be
              in full-screen mode. Minimizing or leaving the screen will
              redirect you to the main screen, and progress will be lost.
            </div>
            <div className="ml-[1vw] mb-2">
              8. <strong>Report an Issue:</strong> If you encounter technical
              issues, click the "Report an Issue" button for assistance.
            </div>
            <div className="ml-[1vw] mb-2">
              9. <strong>Technical Support:</strong> Contact support using the
              details provided at the top of your screen for exam-related
              queries.
            </div>
            <div className="ml-[1vw] mb-2">
              10. <strong>Exam Results:</strong> Your exam results will be
              displayed immediately after submission.
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <label className="inline-flex items-center mb-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="form-checkbox"
            />
            <span className="ml-2">
              I have read and understood the instructions and am ready to start
              the exam.
            </span>
          </label>

          <button
            onClick={() => navigate("/user_test/start_exam")}
            className={`mt-4 px-4 py-2 rounded-lg shadow-md ${
              isChecked
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!isChecked} // ✅ Correct condition
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
