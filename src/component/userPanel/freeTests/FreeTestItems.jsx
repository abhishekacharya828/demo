import React, { useState, useContext, useEffect } from "react";
import { BsChevronDoubleRight, BsChevronDown } from "react-icons/bs";
import { FaClock, FaClipboardList } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import TestName from "../TestComponents/TestName";
import testresults from "../../../assets/tests/Test Results.png";
import girlsitting from "../../../assets/tests/Girl sitting on floor with laptop and studying.png";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const mockTests = [
  { id: 1, name: "Mock Test 1", questions: 50, duration: 60 },
  { id: 2, name: "Mock Test 2", questions: 40, duration: 60 },
];

const FreeTestItems = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { userData, freeTestQuestions, questions, setFreeTestQuestions } =
    useContext(AuthContext);
  const { setSelectedTest } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMockOpen, setIsMockOpen] = useState(true);
  const [role_id, setRoleId] = useState(0);

  const [selectedTest, setSelectedTestState] = useState(mockTests[0]);

  const startTest = (test) => {
    setSelectedTest(test);
    navigate("/instructions", { state: { name: test.name, id: test.id } });
  };
  useEffect(() => {
    console.log("userData.role:", userData?.role); // Debugging

    if (userData?.role === "engineering") {
      console.log("Setting role_id to 2");
      setRoleId(2);
    } else {
      setRoleId(1);
    }
  }, [userData?.role]); // Only updates when userData.role changes
  useEffect(() => {
    if (userData?.class_or_branch) {
    }
  }, [userData?.class_or_branch]);

  useEffect(() => {
    if (role_id !== 0) {
      console.log("Updated role_id:", role_id);
      fetchQuestions(role_id, userData.class_or_branch);
    }
  }, [role_id, userData.class_or_branch]); // Fetch only when role_id updates

  const fetchQuestions = async (role, class_id) => {
    try {
      const finalClas_id = role === 2 ? 10 : parseInt(class_id);
      const response = await fetch(
        `${backendUrl}/api/get-freeTest-questions/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            class_id: parseInt(finalClas_id),
            role_id: role,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Always set data to an empty array if data is null or undefined
      setFreeTestQuestions(Array.isArray(data) ? data : []);
      localStorage.setItem("freequestions", JSON.stringify(data || []));
      console.log("Fetched Questions:", data);

      return data || [];
    } catch (err) {
      console.error("Failed to load questions", err);
      return []; // Return empty array in case of error
    }
  };
  useEffect(() => {
    fetchQuestions();
  }, []);
  

  return (
    <div className="space-y-2 min-h-screen">
      <TestName />
      <div className="flex md:flex-row flex-col gap-[5vw] md:gap-0 space-x-2">
        {/* Sidebar for selecting tests */}
        <div className="md:w-64 w-[100vw] bg-[#F4F4F4] p-4  md:rounded-r-2xl">
          <button
            className="flex items-center font-semibold mb-2 w-full text-left"
            onClick={() => setIsMockOpen(!isMockOpen)}
          >
            {isMockOpen ? (
              <BsChevronDown className="mr-2" />
            ) : (
              <BsChevronDoubleRight className="mr-2" />
            )}
            <span className="text-[#495959] text-xl">Mock Tests</span>
          </button>
          {isMockOpen && (
            <ul className="ml-6">
              {mockTests.map((test) => (
                <li
                  key={test.id}
                  className="flex items-center text-sm mb-1 cursor-pointer hover:font-bold"
                  onClick={() => setSelectedTestState(test)}
                >
                  <img src={testresults} alt="Test" className="mr-2" />
                  <span className="text-[#495959]">{test.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        

        {/* Test Details & Start Button */}
        {selectedTest && (
          <div className="bg-[#F4F4F4] w-full  rounded-lg">
            <button
              onClick={() => navigate(-1)}
              className="flex gap-2 items-center text-xl ml-[2vw] mt-[1.5vw] cursor-pointer text-blue-700 relative z-10"
            >
              <IoArrowBackCircleSharp />
              Back
            </button>
           
          <div className="pl-[7vw] pt-[10vw] md:h-[35.5vw] h-[80vh] shadow-lg w-full mx-auto relative">
           
            <img
              src={girlsitting}
              alt="Watermark"
              className="absolute inset-0 md:w-full md:h-full object-contain mix-blend-multiply"
            />
           

             
            <h2 className="text-2xl font-semibold mb-4">Free Test</h2>
            <div className="mt-[4vw] space-y-4">
              <div className="flex items-center text-gray-800">
                {userData.role === "engineering" && (
                  <>
                    <FaClipboardList className="mr-2 text-lg" />
                    <span>{freeTestQuestions.length} Questions</span>
                  </>
                )}
                {userData.role === "olympiad" && (
                  <>
                    <FaClipboardList className="mr-2 text-lg" />
                    <span>{freeTestQuestions.length} Questions</span>
                  </>
                )}
              </div>
              <div className="flex items-center text-gray-800">
                <FaClock className="mr-2 text-lg" />
                <span>{selectedTest.duration} Minutes</span>
              </div>
            </div>
            <button
              onClick={() =>
                navigate("/instructions", {
                  state: {
                    from: "freetest",
                  },
                })
              }
              className="bg-[#5490ff] text-black px-4 py-2 rounded-md font-semibold transition mt-[3vw] relative z-10"
            >
              Start Test
            </button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeTestItems;
