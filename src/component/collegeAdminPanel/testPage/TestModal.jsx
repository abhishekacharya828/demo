import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const TestModal = ({
  isOpen,
  onClose,
  initialValue = "",
  editingId = null,
  refreshTests,
}) => {
  const [testName, setTestName] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("collegeAccess"); // ✅ Bearer token

  useEffect(() => {
    setTestName(initialValue); // Prefill when editing
  }, [initialValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testName.trim()) return;

    try {
      if (editingId) {
        // ✅ Update existing test
        const res = await fetch(`${backendUrl}/api/user/exams/${editingId}/`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: testName }),
        });
        if (!res.ok) throw new Error("Failed to update test");
      } else {
        // ✅ Add new test
        const res = await fetch(`${backendUrl}/api/user/exams/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: testName }),
        });
        if (!res.ok) throw new Error("Failed to add test");
        if (res.ok) {
          toast.success("Test added successfully");
        }
      }

      setTestName("");
      onClose();
      if (refreshTests) refreshTests(); // ✅ tell parent to reload list
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Test" : "Add New Test"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter test name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {editingId ? "Update" : "Add Test"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TestModal;
