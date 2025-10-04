import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const CollegeAdmin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/schools/`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch schools");
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [backendUrl]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;
    try {
      const response = await fetch(`${backendUrl}/api/admin/schools/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete school");
      toast.success("School deleted successfully");
      setSchools(schools.filter((school) => school.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin_dashboard/edit_college_admin/${id}`);
  };

  if (loading) return <p className="p-4">Loading Colleges...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">College Management</h2>
        <button
          onClick={() => navigate("/college_admin/add_college_admin")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          + Add College Admin
        </button>
      </div>

      {/* Table */}
      {schools.length === 0 ? (
        <p className="text-gray-600 italic">No colleges found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
          <table className="w-full text-left border-collapse overflow-hidden rounded-xl">
            {/* Gradient Header */}
            <thead className="bg-gradient-to-r from-indigo-400 to-pink-400 via-purple-400 text-white text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">City</th>
                <th className="p-4">State</th>
                <th className="p-4">Country</th>
                <th className="p-4">Type</th>
                <th className="p-4">Board</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {schools.map((school, index) => (
                <tr
                  key={school.id}
                  className={`transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 hover:scale-[1.01]`}
                >
                  <td className="p-4 border-b">{school.id}</td>
                  <td className="p-4 border-b font-medium text-gray-800">
                    {school.school_name}
                  </td>
                  <td className="p-4 border-b">{school.city}</td>
                  <td className="p-4 border-b">{school.state}</td>
                  <td className="p-4 border-b">{school.country}</td>
                  <td className="p-4 border-b">{school.school_type}</td>
                  <td className="p-4 border-b">{school.board_affiliation}</td>
                  <td className="p-4 border-b">{school.phone_number}</td>
                  <td className="p-4 border-b flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(school.id)}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-1 text-sm shadow-sm transition cursor-pointer"
                      title="Edit College"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(school.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm shadow-sm transition cursor-pointer"
                      title="Delete College"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CollegeAdmin;
