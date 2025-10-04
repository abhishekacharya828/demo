import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";

const AnalyticsPage = () => {
  const { testName } = useParams(); // here testName will be exam id
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const token = localStorage.getItem("collegeAccess"); // <- corrected key
        if (!token) throw new Error("No access token found");

        const res = await fetch(
          `${backendUrl}/api/user/college-admin/exams-summary/${testName}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setExamData(data);
      } catch (err) {
        console.error("Error fetching exam data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [backendUrl, testName]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!examData) return <div className="p-6">No data available</div>;

  // Process student performance safely
  const studentPerformance =
    examData.student_results?.map((s) => ({
      name: s.student_name,
      score: s.percentage,
    })) || [];

  const totalStudents = examData.total_students || 0;
  const avgScore =
    studentPerformance.length > 0
      ? (
          studentPerformance.reduce((acc, s) => acc + s.score, 0) /
          studentPerformance.length
        ).toFixed(1)
      : 0;

  const highest = studentPerformance.length
    ? Math.max(...studentPerformance.map((s) => s.score))
    : 0;
  const lowest = studentPerformance.length
    ? Math.min(...studentPerformance.map((s) => s.score))
    : 0;

  // Score distribution buckets
  const buckets = [0, 20, 40, 60, 80, 100];
  const scoreDistribution = buckets.slice(1).map((upper, i) => {
    const lower = buckets[i];
    const count = studentPerformance.filter(
      (s) => s.score > lower && s.score <= upper
    ).length;
    return { range: `${lower + 1}-${upper}`, students: count };
  });

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Analytics for <span className="text-indigo-600">{examData.title}</span>
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-500">Total Students</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalStudents}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-500">Average Score</h3>
          <p className="text-3xl font-bold text-blue-600">{avgScore}%</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-500">Highest Score</h3>
          <p className="text-3xl font-bold text-green-600">{highest}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h3 className="text-gray-500">Lowest Score</h3>
          <p className="text-3xl font-bold text-red-600">{lowest}</p>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Score Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Student Performance Table */}
      {/* Student Performance Table */}
      <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Student Performance
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Student</th>
              <th className="p-3 border">Marks Obtained</th>
              <th className="p-3 border">Tech Marks</th>
              <th className="p-3 border">Non-Tech Marks</th>
              <th className="p-3 border">Total Marks</th>
              <th className="p-3 border">Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            {examData.student_results?.map((s, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border">{s.student_name}</td>
                <td className="p-3 border font-semibold">{s.marks_obtained}</td>
                <td className="p-3 border font-semibold">
                  {s.marks_obtained_tech}
                </td>
                <td className="p-3 border font-semibold">
                  {s.marks_obtained_nontech}
                </td>
                <td className="p-3 border font-semibold">{s.total_marks}</td>
                <td
                  className={`p-3 border font-semibold ${
                    s.percentage >= 75
                      ? "text-green-600"
                      : s.percentage >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {s.percentage}
                </td>
              </tr>
            ))}
            {examData.not_appeared_students?.map((s, index) => (
              <tr key={`na-${index}`} className="bg-red-50">
                <td className="p-3 border">{s.student_name}</td>
                <td
                  className="p-3 border font-semibold text-red-400"
                  colSpan={5}
                >
                  Did Not Appear
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
