import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditStudents = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const access = localStorage.getItem("collegeAccess");

  const [studentData, setStudentData] = useState({
    registration_number: "",
    first_name: "",
    last_name: "",
    email: "",
    
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/user/students/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch student data");
        const data = await response.json();
        setStudentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [backendUrl, id, access]);

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/user/students/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) throw new Error("Failed to update student");
      toast.success("Student updated successfully!");
      navigate("/admin_dashboard/students");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <p className="p-4">Loading student data...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="flex justify-center items-start p-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
  <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
    <h2 className="text-2xl font-bold text-blue-700 text-center">Edit Student</h2>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      {/* Registration Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
        <input
          type="text"
          name="registration_number"
          value={studentData.registration_number || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <input
          type="text"
          name="first_name"
          value={studentData.first_name || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={studentData.last_name || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={studentData.email || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Update Student
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default EditStudents;
