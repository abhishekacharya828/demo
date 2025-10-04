import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Upload, FileSpreadsheet, ArrowLeft } from "lucide-react";

const AddAllQuestions = () => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const access = localStorage.getItem("collegeAccess");
  const navigate = useNavigate();

  const required_fields = [
    "question_text",
    "option_a",
    "option_b",
    "option_c",
    "option_d",
    "correct_option",
    "description",
    "marks",
  ];

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));

      const headers = rows[0].map((h) => h.trim());
      const data = rows.slice(1).map((row) =>
        row.reduce((obj, value, index) => {
          obj[headers[index]] = value.trim();
          return obj;
        }, {})
      );

      setCsvData(data);
    };
    reader.readAsText(uploadedFile);
  };

  const handleUploadClick = async () => {
    if (!file) {
      toast.error("Please select a CSV file before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${backendUrl}/api/user/upload-bulk-questions/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Upload failed: " + (errorData?.error || "Server error"));
      } else {
        const result = await response.json();
        toast.success("Questions uploaded successfully!");
        setFile(null);
        setCsvData([]);
      }
    } catch (error) {
      toast.error("Something went wrong while uploading.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Back Button */}
      <div className="w-full max-w-5xl mb-4">
        <button
          onClick={() => navigate("/college/add_single_question")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
        >
          
          Upload Single Question
        </button>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Bulk Question Upload
        </h2>

        {/* File Upload Section */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-10 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition"
        >
          {file ? (
            <>
              <FileSpreadsheet className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-gray-700 font-semibold">{file.name}</p>
              <p className="text-gray-400 text-sm mt-1">
                Click to choose another file
              </p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-blue-400 mb-3" />
              <p className="text-gray-700 font-semibold">Drag & Drop CSV</p>
              <p className="text-gray-400 text-sm">or click to browse</p>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* CSV Preview */}
        {csvData.length > 0 && (
          <div className="mt-8 overflow-x-auto max-h-[50vh] overflow-y-auto border rounded-xl">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {Object.keys(csvData[0]).map((header, idx) => (
                    <th
                      key={idx}
                      className="py-3 px-4 border-b border-gray-200 font-semibold text-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {Object.values(row).map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className="py-2 px-4 border-b border-gray-100"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleUploadClick}
            className="px-6 py-3 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition"
          >
            <Upload size={18} />
            Upload Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAllQuestions;
