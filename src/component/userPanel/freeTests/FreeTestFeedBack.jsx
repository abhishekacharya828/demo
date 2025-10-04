import React, { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";

const FreeTestFeedBack = () => {
  const [courses, setCourses] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState({});

  useEffect(() => {
    const storedResult = localStorage.getItem("examResult");

    if (storedResult) {
      const parsedResult = JSON.parse(storedResult);
      console.log("Parsed Exam Result:", parsedResult);

      if (
        parsedResult.course_results &&
        Array.isArray(parsedResult.course_results) &&
        parsedResult.course_results.length > 0
      ) {
        const formattedCourses = parsedResult.course_results.map((result) => ({
          name: result.course_name,
          score: result.percentage.toFixed(2),
          feedback: result.feedback,
        }));
        setCourses(formattedCourses);
      } else {
        console.log("Parsed data is empty or not an array");
      }
    } else {
      console.log("No examResult found in localStorage");
    }
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getShortText = (text, wordLimit = 5) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <div className="flex flex-wrap gap-6 justify-center items-center md:p-4">
      {courses.length > 0 ? (
        courses.map((course, index) => (
          <div
            key={index}
            className="md:w-[35vw] w-[90%] bg-white p-6 shadow-lg rounded-2xl flex flex-col items-center justify-center"
          >
            {/* Speedometer Gauge */}
            <div className="relative flex justify-center w-full">
              <ReactSpeedometer
                maxValue={100}
                value={course.score}
                needleColor="blue"
                startColor="red"
                segments={5}
                endColor="green"
                width={200}
                height={150}
                currentValueText={`${course.score}%`}
              />
            </div>

            {/* Course Name */}
            <h2 className="text-xl font-bold mt-4 text-center">{course.name}</h2>

            {/* Feedback with "Read more" */}
            <p className="text-gray-600 mt-2 text-center">
              {expandedIndexes[index]
                ? course.feedback
                : getShortText(course.feedback, 5)}
            </p>
            {course.feedback.split(" ").length > 5 && (
              <button
                onClick={() => toggleExpand(index)}
                className="text-blue-500 text-sm mt-1 hover:underline cursor-pointer"
              >
                {expandedIndexes[index] ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No feedback available.</p>
      )}
    </div>
  );
};

export default FreeTestFeedBack;
