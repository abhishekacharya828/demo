import React, { useState } from "react";
import toast from "react-hot-toast";
import UserLayout from "../../layout/UserLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Settings = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.new_password !== formData.confirm_password) {
      toast.error("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    const accessToken = localStorage.getItem("userAccess");
    if (!accessToken) {
      toast.error("No access token found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setShowModal(false);
        setFormData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData?.detail || "Failed to change password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-200"
        >
          Change Password
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative animate-fadeIn">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Change Password
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Old Password */}
                <div className="relative">
                  <input
                    type={showPassword.old ? "text" : "password"}
                    name="old_password"
                    placeholder="Old Password"
                    value={formData.old_password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-3 pr-10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <span
                    onClick={() => togglePasswordVisibility("old")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showPassword.old ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* New Password */}
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="new_password"
                    placeholder="New Password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-3 pr-10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <span
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* Confirm Password */}
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm New Password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Settings;
