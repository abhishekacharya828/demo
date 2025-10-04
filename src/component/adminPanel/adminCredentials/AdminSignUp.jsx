import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Logo from "../../../assets/logo/WaveIQ Logo.png";

const AdminSignUp = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/admin/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone,
          password_hash: formData.password,
        }),
      });
      if (response.status === 201) {
        toast.success("Admin registered successfully");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
          confirmpassword: "",
        });
        navigate("/admin_login");
      }
    } catch (error) {
      console.error("error while registering");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300 flex flex-col">
      {/* Navbar with Logo */}
      <header className="w-full flex items-center px-6 py-4">
        <img src={Logo} alt="Logo" className="h-10" />
      </header>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/40"
        >
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
            Admin Sign Up
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Row: First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="peer pl-10 p-3 w-full bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-indigo-600">
                  First Name
                </label>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="peer pl-10 p-3 w-full bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-indigo-600">
                  Last Name
                </label>
              </div>
            </div>

            {/* Row: Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="peer pl-10 p-3 w-full bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-indigo-600">
                  Email
                </label>
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="peer pl-10 p-3 w-full bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-indigo-600">
                  Phone
                </label>
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="peer pl-10 pr-10 p-3 w-full bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-indigo-600">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                required
                className="peer pl-10 pr-10 p-3 w-full bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label className="absolute left-10 top-3 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-indigo-600">
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all"
            >
              Sign Up
              <ArrowRight size={18} />
            </motion.button>
          </form>

          <p className="text-center mt-6 text-gray-700">
            Already registered?{" "}
            <span
              onClick={() => navigate("/admin_login")}
              className="text-indigo-700 font-semibold hover:underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSignUp;
