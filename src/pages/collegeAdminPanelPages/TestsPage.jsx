import React, { useState, useEffect, useContext } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TestModal from "../../component/collegeAdminPanel/testPage/TestModal";
import { AuthContext } from "../../context/AuthContext";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("collegeAccess");
  const { selectedTestId, setSelectedTestId } = useContext(AuthContext);

  useEffect(() => {
    fetchTests();
  }, [navigate]);

  const fetchTests = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/exams/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch tests");
      const data = await res.json();
      setTests(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add test
  const handleAddTest = async (testTitle) => {
    try {
      const res = await fetch(`${backendUrl}/api/user/exams/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: testTitle }),
      });
      if (!res.ok) throw new Error("Failed to add test");
      await fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Update test inline
  const handleUpdateTest = async (index) => {
    try {
      const testToUpdate = tests[index];
      const res = await fetch(
        `${backendUrl}/api/user/exams/${testToUpdate.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editTitle,
            start_time: editStartTime,
            end_time: editEndTime,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update test");
      await fetchTests();
      setEditingIndex(null);
      setEditTitle("");
      setEditStartTime("");
      setEditEndTime("");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete test
  const handleDelete = async (index) => {
    try {
      const testToDelete = tests[index];
      const res = await fetch(
        `${backendUrl}/api/user/exams/${testToDelete.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete test");
      await fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (index, test) => {
    setEditingIndex(index);
    setEditTitle(test.title);
    setEditStartTime(test.start_time.slice(0, 16)); // for datetime-local input
    setEditEndTime(test.end_time.slice(0, 16));
  };

  const handleOpenTest = (testId) => {
    setSelectedTestId(testId);
    navigate(`/college/tests/${encodeURIComponent(testId)}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tests</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Test
        </button>
      </div>

      {/* Tests List */}
      {tests.length === 0 ? (
        <p className="text-gray-600">No tests added yet.</p>
      ) : (
        <ul className="space-y-3">
          {tests.map((test, index) => (
            <li
              key={test.id}
              className="p-4 bg-white rounded-lg shadow flex flex-col gap-2"
            >
              {editingIndex === index ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                    placeholder="Test Title"
                  />
                  <label className="text-sm text-gray-600">Start Time:</label>
                  <input
                    type="datetime-local"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <label className="text-sm text-gray-600">End Time:</label>
                  <input
                    type="datetime-local"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateTest(index)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full transition"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingIndex(null);
                        setEditTitle("");
                        setEditStartTime("");
                        setEditEndTime("");
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span
                      onClick={() => handleOpenTest(test.id)}
                      className="font-medium cursor-pointer hover:text-indigo-600"
                    >
                      {test.title}
                    </span>
                    <div className="flex items-center gap-3">
                      {/* <button
                        onClick={() => handleEdit(index, test)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
                      >
                        <Pencil size={18} />
                      </button> */}
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Test details */}
                  <div className="text-gray-600 text-sm mt-1 space-y-1">
                    <p>
                      <strong>Created On:</strong>{" "}
                      {test.created_on
                        ? new Date(test.created_on).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      <strong>Start Time:</strong>{" "}
                      {test.start_time
                        ? new Date(test.start_time).toLocaleString()
                        : "-"}
                    </p>
                    <p>
                      <strong>End Time:</strong>{" "}
                      {test.end_time
                        ? new Date(test.end_time).toLocaleString()
                        : "-"}
                    </p>
                    <p>
                      <strong>Questions:</strong> {test.questions?.length || 0}
                    </p>
                    <p>
                      <strong>Students:</strong> {test.students?.length || 0}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {test.updated_on
                        ? new Date(test.updated_on).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal only for Add */}
      <TestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTest={handleAddTest}
        refreshTests={fetchTests} 
      />
    </div>
  );
};

export default Tests;
