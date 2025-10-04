import React, { useState } from "react";
import toast from "react-hot-toast";

const AddBulkStudents = () => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const access = localStorage.getItem("collegeAccess");
  const refresh = localStorage.getItem("collegeRefresh");
  const user = JSON.parse(localStorage.getItem("collegeUser"));

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));

      // Convert rows to array of objects
      const headers = rows[0];
      const data = rows.slice(1).map((row) =>
        row.reduce((obj, value, index) => {
          obj[headers[index]?.trim()] = value.trim();
          return obj;
        }, {})
      );

      setCsvData(data);
    };
    reader.readAsText(uploadedFile);
  };

  const handleUploadClick = async () => {
    if (!file) {
      alert("Please select a file before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${backendUrl}/api/user/register-bulk-students/`,
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
        console.error("Upload failed:", errorData);
        alert("Upload failed: " + (errorData?.error || "Server error"));
      } else {
        const result = await response.json();
        console.log("Upload success:", result);
        toast.success("Students uploaded successfully!");

        setFile(null);
        setCsvData([]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Something went wrong while uploading.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Upload Students
        </h2>

        {/* File Upload */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-6 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition"
        >
          {file ? (
            <>
              <p className="text-gray-700 font-semibold">{file.name}</p>
              <p className="text-gray-400 text-sm mt-1">Click to change file</p>
            </>
          ) : (
            <>
              <svg
                className="w-12 h-12 text-blue-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16v-4a4 4 0 118 0v4m-4 4v-4m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 font-semibold">Click to upload CSV</p>
              <p className="text-gray-400 text-sm">or drag & drop</p>
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
          <>
            <div className="mt-8 overflow-x-auto max-h-[30vw] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Preview Students:
              </h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    {Object.keys(csvData[0]).map((header, idx) => (
                      <th
                        key={idx}
                        className="py-2 px-4 border-b border-gray-200 text-left font-medium text-gray-600"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {Object.values(row).map((value, colIndex) => (
                        <td
                          key={colIndex}
                          className="py-2 px-4 border-b border-gray-100 text-sm text-gray-700"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Upload Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleUploadClick}
            className="w-auto px-6 flex justify-center items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Upload Students
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBulkStudents;
