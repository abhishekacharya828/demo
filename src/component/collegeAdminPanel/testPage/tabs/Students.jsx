import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../../context/AuthContext";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // ✅ Select All state
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const access = localStorage.getItem("collegeAccess");
  const { selectedTestId, setSelectedTestId } = useContext(AuthContext);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/students/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Checkbox toggle
  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) => {
      const updated = prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId];

      // Update Select All state
      setSelectAll(updated.length === students.length);

      return updated;
    });
  };

  // Select All toggle
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
      setSelectAll(false);
    } else {
      setSelectedStudents(students.map((s) => s.id));
      setSelectAll(true);
    }
  };

  // PATCH function to update exam with selected students
  const updateExamStudents = async (studentIds) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/user/exams/${selectedTestId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ students: studentIds }),
        }
      );
      if (!response.ok) throw new Error("Failed to update exam");
      toast.success("Exam updated with selected students!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update exam");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Students</h2>

      {/* Select All */}
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="w-5 h-5 text-blue-500 rounded"
        />
        <span className="ml-2 text-gray-700 font-medium">Select All</span>
      </div>

      {/* Students list */}
      <div className="space-y-2">
        {students.length === 0 ? (
          <p>No students found</p>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="flex items-center bg-white p-3 rounded shadow hover:bg-gray-50"
            >
              {/* Checkbox and Name */}
              <div className="flex items-center w-1/4 space-x-3">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleCheckboxChange(student.id)}
                  className="w-5 h-5 text-blue-500 rounded"
                />
                <span className="text-gray-700">
                  {student.first_name} {student.last_name} (
                  {student.registration_number})
                </span>
              </div>

              {/* Email */}
              <div className="w-1/4 text-gray-700">{student.email}</div>

              {/* Program */}
              <div className="w-1/4 text-gray-700">{student.program}</div>

              {/* Branch */}
              <div className="w-1/4 text-gray-700">{student.branch}</div>
            </div>
          ))
        )}
      </div>

      {/* Update Exam button */}
      {selectedStudents.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => {
              if (!window.confirm("Update exam with selected students?"))
                return;
              updateExamStudents(selectedStudents);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Update Exam
          </button>
        </div>
      )}
    </div>
  );
};

export default Students;
