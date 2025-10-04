import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SchedulePage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("collegeAccess");

  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const { examId } = useParams();
  const { selectedTestId } = useContext(AuthContext);

  const handleUpdateSchedule = async () => {
    if (!startDateTime || !endDateTime) {
      alert("Please select both start and end date/time");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${backendUrl}/api/user/exams/${selectedTestId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update schedule");

      alert("Schedule updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error updating schedule ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">Schedule Exam</h2>

      <div className="flex flex-col gap-5">
        {/* Start DateTime Picker */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Start Date & Time
          </label>
          <DatePicker
            selected={startDateTime}
            onChange={(date) => setStartDateTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select start date & time"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* End DateTime Picker */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            End Date & Time
          </label>
          <DatePicker
            selected={endDateTime}
            onChange={(date) => setEndDateTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select end date & time"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpdateSchedule}
          disabled={loading}
          className="px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex justify-center"
        >
          {loading ? "⏳ Updating..." : "Update Schedule"}
        </button>
      </div>
    </div>
  );
};

export default SchedulePage;
