import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaEdit } from "react-icons/fa";
import { AuthContext } from "../../../../context/AuthContext";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    description: "",
    marks: 1,
  });
   const { selectedTestId, setSelectedTestId } = useContext(AuthContext);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const access = localStorage.getItem("collegeAccess");

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/questions/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Checkbox toggle
  const handleCheckboxChange = (questionId) => {
    setSelectedQuestions((prev) => {
      const updated = prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId];

      setSelectAll(updated.length === questions.length);

      return updated;
    });
  };

  // PATCH function to update exam
  const updateExamQuestions = async (questionIds) => {
    // if (!selectedExamId) {
    //   toast.error("Please select an exam first");
    //   return;
    // }

    try {
      const response = await fetch(`${backendUrl}/api/user/exams/${selectedTestId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ questions: questionIds }),
      });

      if (!response.ok) throw new Error("Failed to update exam");

      toast.success("Exam updated with selected questions!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update exam");
    }
  };

  // Delete question
  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const response = await fetch(`${backendUrl}/api/user/questions/${questionId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${access}` },
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Question deleted successfully!");
      fetchQuestions();
      setSelectedQuestions((prev) => prev.filter((id) => id !== questionId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };

  // Open form for edit
  const handleEdit = (question) => {
    setEditingQuestionId(question.question_id);
    setNewQuestion({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_option: question.correct_option,
      description: question.description,
      marks: question.marks,
    });
    setShowForm(true);
  };

  // Add or Update question
  const handleAddOrUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const url = editingQuestionId
        ? `${backendUrl}/api/user/questions/${editingQuestionId}/`
        : `${backendUrl}/api/user/questions/`;
      const method = editingQuestionId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) throw new Error(editingQuestionId ? "Update failed" : "Add failed");

      toast.success(editingQuestionId ? "Question updated!" : "Question added!");
      fetchQuestions();
      setShowForm(false);
      setEditingQuestionId(null);
      setNewQuestion({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
        description: "",
        marks: 1,
      });
    } catch (error) {
      console.error(error);
      toast.error(editingQuestionId ? "Failed to update question" : "Failed to add question");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Questions</h2>

      {/* Exam selection */}
      {/* <div className="mb-4 flex items-center space-x-2">
        <label className="font-medium">Exam ID:</label>
        <input
          type="number"
          value={selectedExamId || ""}
          onChange={(e) => setSelectedExamId(Number(e.target.value))}
          placeholder="Enter exam ID"
          className="p-2 border rounded w-32"
        />
      </div> */}

      {/* <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2"
      >
        Add Question
      </button> */}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingQuestionId ? "Edit Question" : "Add New Question"}
            </h3>
            <form onSubmit={handleAddOrUpdateQuestion} className="space-y-3">
              <input
                type="text"
                placeholder="Question Text"
                value={newQuestion.question_text}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question_text: e.target.value })
                }
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Option A"
                value={newQuestion.option_a}
                onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Option B"
                value={newQuestion.option_b}
                onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Option C"
                value={newQuestion.option_c}
                onChange={(e) => setNewQuestion({ ...newQuestion, option_c: e.target.value })}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Option D"
                value={newQuestion.option_d}
                onChange={(e) => setNewQuestion({ ...newQuestion, option_d: e.target.value })}
                required
                className="w-full p-2 border rounded"
              />
              <select
                value={newQuestion.correct_option}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, correct_option: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
              <textarea
                placeholder="Description"
                value={newQuestion.description}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, description: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Marks"
                value={newQuestion.marks}
                onChange={(e) => setNewQuestion({ ...newQuestion, marks: e.target.value })}
                required
                className="w-full p-2 border rounded"
                min="1"
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingQuestionId(null);
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-2"
                >
                  {editingQuestionId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Select All */}
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={() => {
            setSelectAll(!selectAll);
            if (!selectAll) {
              setSelectedQuestions(questions.map((q) => q.question_id));
            } else {
              setSelectedQuestions([]);
            }
          }}
          className="w-5 h-5 text-blue-500 rounded"
        />
        <span className="ml-2 text-gray-700 font-medium">Select All</span>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.question_id}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:bg-gray-50"
          >
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(q.question_id)}
                onChange={() => handleCheckboxChange(q.question_id)}
                className="w-5 h-5 text-blue-500 rounded"
              />
              <span className="text-gray-700">{q.question_text}</span>
            </label>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(q)}
                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 flex items-center"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(q.question_id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Exam button */}
      {selectedQuestions.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => {
              if (!window.confirm("Update exam with selected questions?")) return;
              updateExamQuestions(selectedQuestions);
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

export default Questions;
