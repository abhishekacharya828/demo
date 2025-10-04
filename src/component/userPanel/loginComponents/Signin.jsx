import React, { useContext, useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import logo from "../../../assets/logo/WaveIQ Logo.png";

const Signin = () => {
  const { setTokens, setUserData, setRefreshtokens } = useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { value, name } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        role: "student", // ✅ always send student role
      };

      const response = await fetch(`${backendUrl}/api/user/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.success("Student logged in successfully");

        localStorage.setItem("userAccess", data.access);
        localStorage.setItem("userRefresh", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        setForm({ email: "", password: "" });
        navigate("/user_profile");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error(`Error logging in: ${error}`);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-32 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 -right-32 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      {/* 🔥 Logo fixed at top-left of the page */}
      <div className="absolute top-6 left-6 flex items-center space-x-2 select-none z-20">
        <img src={logo} alt="Logo" className=" object-contain drop-shadow-lg" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-8 pt-12 bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-white mb-8 mt-2 tracking-wide select-none animate-fadeIn">
          Welcome To WaveIQ{" "}
          <span aria-label="wave" role="img">
            👋
          </span>
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          {/* Email */}
          <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-xl border border-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-inner">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              value={form.email}
              name="email"
              onChange={handleFormChange}
              placeholder="Email address"
              className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-xl border border-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-inner">
            <FaLock className="text-gray-400 mr-3" />
            <input
              value={form.password}
              name="password"
              onChange={handleFormChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="ml-2 p-1 outline-none rounded focus:ring-2 focus:ring-blue-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </button>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              to="/ForgotPassword"
              className="hover:text-blue-500 text-blue-400 text-sm font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-blue-600 to-purple-500 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:opacity-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Sign In
          </button>
        </form>

        {/* Signup toggle */}
        {/* <div className="mt-8 flex justify-center text-gray-400 text-sm">
          Don’t have an account?
          <button
            className="ml-2 text-blue-400 hover:text-blue-500 font-semibold transition-colors"
            onClick={() => navigate("/user_signup")}
          >
            Sign Up
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Signin;
