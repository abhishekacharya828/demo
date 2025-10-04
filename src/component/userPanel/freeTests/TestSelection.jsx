import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Code, Brain } from "lucide-react";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const TestSelection = () => {
  const navigate = useNavigate();

  const tests = [
    {
      title: "Technical Test",
      description:
        "Challenge yourself with programming, problem-solving, and core technical questions.",
      color: "from-blue-500 to-indigo-600",
      hover: "hover:from-blue-600 hover:to-indigo-700",
      icon: <Code className="w-12 h-12 text-white" />,
      type: "tech",
    },
    {
      title: "Non-Technical Test",
      description:
        "Evaluate your logical reasoning, aptitude, and general awareness skills.",
      color: "from-purple-500 to-pink-600",
      hover: "hover:from-purple-600 hover:to-pink-700",
      icon: <Brain className="w-12 h-12 text-white" />,
      type: "nontech",
    },
  ];

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/user_test/instructions" , { replace: true })}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full 
                   bg-blue-600 text-white font-medium text-lg 
                   shadow-md hover:bg-blue-700 hover:shadow-lg 
                   transition-transform transform hover:scale-105"
      >
        <IoArrowBackCircleSharp className="w-6 h-6" />
        Back
      </button>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-extrabold mb-12 text-gray-800 text-center">
          Choose Your <span className="text-indigo-600">Test</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          {tests.map((test, index) => (
            <div
              key={index}
              className={`relative group bg-gradient-to-br ${test.color} ${test.hover} 
            rounded-2xl shadow-xl p-8 text-center transform transition duration-300 
            hover:scale-105 cursor-pointer`}
              onClick={() =>
                navigate("/user_test/start_exam", {
                  state: { type: test.type },
                })
              }
            >
              <div className="flex justify-center mb-6">{test.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {test.title}
              </h2>
              <p className="text-white/90 mb-6 leading-relaxed">
                {test.description}
              </p>
              <button
                className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md 
              hover:bg-gray-100 transition"
              >
                Start
              </button>

              {/* subtle overlay effect */}
              <div className="absolute inset-0 rounded-2xl bg-black/10 opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestSelection;
