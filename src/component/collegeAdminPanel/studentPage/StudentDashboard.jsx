import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa";
import { IoEyeOff, IoEye } from "react-icons/io5";
import toast from "react-hot-toast";

const SchoolManagement = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const navigate = useNavigate();
  const access = localStorage.getItem("collegeAccess");

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/students/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [backendUrl]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      const response = await fetch(`${backendUrl}/api/user/students/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete student");
      toast.success("Student deleted successfully");
      setStudents(students.filter((student) => student.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`edit_student/${id}`);
  };

  const openChangePasswordModal = (student) => {
    setSelectedStudent(student);
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(true);
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/change-user-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({
            email: selectedStudent.email, // ✅ use email instead of id
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
        <div className="flex gap-3 mt-3 md:mt-0">
          <button
            onClick={() => navigate("add_bulk_students")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            Bulk Add
          </button>
          <button
            onClick={() => navigate("add_students")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      {loading && <p className="p-4">Loading students...</p>}
      {error && <p className="p-4 text-red-500">Error: {error}</p>}

      {students.length === 0 && !loading ? (
        <p className="text-gray-600">No students found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Registration No.</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Program</th>
                <th className="p-3 border-b">Branch</th>
                <th className="p-3 border-b">Actions</th>
                <th className="p-3 border-b">Change Password</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 border-b">{student.id}</td>
                  <td className="p-3 border-b">
                    {student.registration_number}
                  </td>
                  <td className="p-3 border-b font-medium">
                    {student.first_name}{" "}
                    {student.middle_name ? student.middle_name + " " : ""}
                    {student.last_name}
                  </td>
                  <td className="p-3 border-b">{student.program}</td>
                  <td className="p-3 border-b">{student.branch}</td>
                  <td className="p-3 border-b flex gap-2">
                    <button
                      onClick={() => handleEdit(student.id)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                      title="Edit Student"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                      title="Delete Student"
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => openChangePasswordModal(student)}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 flex items-center gap-1"
                      title="Change Password"
                    >
                      <FaKey /> Change
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[400px] animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Change Password
            </h2>

            {/* Email (Read-only) */}
            <input
              type="email"
              value={selectedStudent?.email || ""}
              disabled
              className="w-full border px-3 py-2 rounded-lg mb-3 bg-gray-100 text-gray-600 cursor-not-allowed"
            />

            {/* New Password */}
            <div className="relative mb-3">
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showNewPass ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-4">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirmPass ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolManagement;
