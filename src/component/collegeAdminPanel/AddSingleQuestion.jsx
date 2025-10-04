import React, { useState } from "react";

export default function AddSingleQuestion() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const access = localStorage.getItem("collegeAccess");

  const [formData, setFormData] = useState({
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "",
    description: "",
    marks: "",
    exam_type:"",
    question_type:"",
  });

  const [questionText, setQuestionText] = useState(""); 
  const [questionImage, setQuestionImage] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTextChange = (e) => setQuestionText(e.target.value);
  const handleImageChange = (e) => setQuestionImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      if (questionText) data.append("question_text", questionText);
      if (questionImage) data.append("question_image", questionImage);
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      const response = await fetch(
        `${backendUrl}/api/user/upload-single-question/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${access}` },
          body: data,
        }
      );

      if (!response.ok) throw new Error("Failed to add question");

      alert("Question added successfully!");
      setFormData({
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "",
        description: "",
        marks: "",
        exam_type:"",
        question_type:"",
      });
      setQuestionText("");
      setQuestionImage(null);
    } catch (error) {
      console.error(error);
      alert("Failed to add question");
    }

    setLoading(false);
  };

  const inputClasses =
    "block w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition mb-2";

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-start py-10">
      <div className="max-w-2xl w-full p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-7 text-blue-800 text-center">
          Upload New Question
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Question Text or Image */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Question Text
            </label>
            <input
              type="text"
              value={questionText}
              onChange={handleTextChange}
              className={inputClasses}
              placeholder="Type your question"
            />

            <label className="block mt-3 mb-1 font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600"
            />
            {questionImage && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {questionImage.name}
              </p>
            )}
          </div>

          {/* Options */}
          <div>
            <label className="block mb-3 font-medium text-gray-700">
              Options
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["a", "b", "c", "d"].map((opt) => (
                <input
                  key={opt}
                  type="text"
                  name={`option_${opt}`}
                  value={formData[`option_${opt}`]}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder={`Option ${opt.toUpperCase()}`}
                  required
                />
              ))}
            </div>
          </div>

          {/* Correct Option & Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Correct Option<span className="text-red-500">*</span>
              </label>
              <select
                name="correct_option"
                value={formData.correct_option}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">-- Select Option --</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Marks
              </label>
              <input
                type="number"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g. 5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Exam Type<span className="text-red-500">*</span>
              </label>
              <select
                name="exam_type"
                value={formData.exam_type}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">-- Select Option --</option>
                <option value="tech">Technical</option>
                <option value="nontech">Non Technical</option>
              
              </select>
            </div>

             <div>
              <label className="block mb-1 font-medium text-gray-700">
                Question Type<span className="text-red-500">*</span>
              </label>
              <select
                name="question_type"
                value={formData.question_type}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">-- Select Option --</option>
                <option value="aptitude">Aptitude</option>
                <option value="reasoning">Reasoning</option>
                <option value="verbal">Verbal Ability</option>
                <option value="coding">Coding</option>
                
              
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClasses}
              rows={3}
              placeholder="Add explanation (optional)"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-3 text-lg font-semibold rounded-xl ${
              loading ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-800"
            } text-white transition flex items-center justify-center`}
            disabled={loading}
          >
            {loading && <span className="animate-spin mr-2">⏳</span>} Upload
            Question
          </button>
        </form>
      </div>
    </div>
  );
}
