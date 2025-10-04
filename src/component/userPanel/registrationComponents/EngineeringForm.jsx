import React, { useState } from "react";
import "./FormInput.css";
import {
  FaUser,
  FaVenusMars,
  FaCalendar,
  FaEnvelope,
  FaUniversity,
  FaLock,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaKey,
  FaMobile,
  FaWhatsapp,
} from "react-icons/fa";
import { FaCodeBranch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo/WaveIQ Logo.png";
import { LiaAddressCardSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import { GrFormPrevious } from "react-icons/gr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EngineeringForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [dob, setDOB] = useState(null); // Initialize with null

  // Function to format the date in YYYY-MM-DD
  const formatDateToLDAP = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDOBChange = (date) => {
    const formattedDate = formatDateToLDAP(date);
    setDOB(formattedDate); // Set the formatted date in the state
    console.log(formattedDate); // Log the formatted date to the console
  };
  console.log("outside ", dob);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    email: "",
    mobile: "",
    whatsapp: "",
    state: "",
    pinCode: "",
    address: "",
    collegeName: "",
    branch: "",
    password: "",
    confirmPassword: "",
    role: "engineering",
    course_1: null,
    course_2: null,
    course_3: null,
    course_4: null,
    year: "",
  });

  const stateNames = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Jammu & Kashmir",
  ];

  const whatsappCheckBox = (e) => {
    const { checked } = e.target;
    if (checked) {
      // Set WhatsApp to be the same as mobile when checkbox is checked
      setFormData((prevData) => ({
        ...prevData,
        whatsapp: prevData.mobile,
      }));
    } else {
      // Clear WhatsApp if checkbox is unchecked
      setFormData((prevData) => ({
        ...prevData,
        whatsapp: "",
      }));
    }
  };

  console.log("first", formData);
  const yearOfCollage = [
    { value: 9, name: "BCA" },
    { value: 10, name: "MCA" },
    { value: 11, name: "B.TECH" },
    { value: 12, name: "M.Tech" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "fullName",
      "gender",
      "email",
      "mobile",
      "year",
      "password",
      "confirmPassword",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field} is required!`);
        return;
      }
    }
    if (formData.mobile.length !== 10) {
      toast.error("Mobile number must be a valid 10 digit");
      return;
    }
    if (formData.whatsapp.length !== 10) {
      toast.error("Whatsapp number must be a valid 10 digit");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    for (const requirement of passwordRequirements) {
      if (!requirement.test(formData.password)) {
        toast.error(`Password ${requirement.message}`);
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Confirm Password is not same as password ! ");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
          email: formData.email,
          mob_no: formData.mobile,
          wp_no: formData.whatsapp,
          class_or_branch: formData.year,
          dob: dob,
          school_or_college_name: formData.collegeName,
          address: formData.address,
          pincode: formData.pinCode,
          state: formData.state,
          course_1: formData.course_1,
          course_2: formData.course_2,
          course_3: formData.course_3,
          course_4: formData.course_4,
          role: formData.role,
          gender: formData.gender,
          full_name: formData.fullName,
        }),
      });

      if (response.status !== 201) {
        toast.error("Email Already Exist. Please check your credentials.");
      }

      if (response.status === 201) {
        toast.success("Sucessfully Registered");

        navigate("/user_signin");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error(`Error updating details:, ${error}`);
    }
  };

  const passwordRequirements = [
    {
      test: (password) => password.length >= 8,
      message: "Must be at least 8 characters long.",
    },

    {
      test: (password) => /[a-z]/.test(password),
      message: "Must include at least one lowercase letter.",
    },
    {
      test: (password) => /[A-Z]/.test(password),
      message: "Must include at least one uppercase letter.",
    },
    {
      test: (password) => /[0-9]/.test(password),
      message: "Must include at least one number.",
    },
    {
      test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      message: "Must include at least one special character.",
    },
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col space-y-4 w-full max-w-2xl p-6 rounded-3xl shadow-lg bg-white">
        {/* Logo + Back */}
        <div className="flex items-center justify-between">
          <div className="mb-2 md:w-[10vw] md:h-[5vw] w-[20vw] h-[10vw]">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <Link
            to="/user_signin"
            state={{ show: true }}
            className="flex items-center font-semibold text-gray-400"
          >
            <GrFormPrevious /> <span>Back</span>
          </Link>
        </div>

        {/* Title */}
        <div className="flex items-center w-full">
          <hr className="flex-grow border-gray-300" />
          <h2 className="text-blue-700 text-xl md:text-2xl font-bold mx-2 text-center">
            Engineering Registration
          </h2>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* --- Your Inputs --- */}
        {/* keep all your form fields here as before */}
        <div className="flex items-center bg-[#f5f5f5] p-2 rounded-3xl border border-gray-300 shadow-md">
          <FaUser className="text-gray-500 mr-2" />
          <span className="text-red-500">*</span>
          <input
            required
            type="text"
            name="fullName"
            placeholder="Full Name "
            onChange={handleChange}
            className="w-full outline-none  text-[#4a4a4a]"
          />
        </div>

        <div className="md:flex space-x-4 w-full md:space-y-0 space-y-4">
          <div className="md:w-[50%] w-full flex items-center bg-[#f5f5f5] p-2 rounded-3xl border border-gray-300 shadow-md">
            <FaVenusMars className="text-gray-500 mr-2" />

            <select
              required
              name="gender"
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-[#4a4a4a]"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              {/* <option value="Other">Other</option> */}
            </select>
          </div>
          <div className="flex items-center p-2 md:w-[45%]  rounded-3xl bg-[#f5f5f5] border border-gray-300 shadow-md w-full">
            <FaCalendar className="text-gray-500 mr-2" />

            <DatePicker
              selected={
                dob ? new Date(dob.split("/").reverse().join("-")) : null
              } // Set the selected date if available
              onChange={handleDOBChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="DOB"
              className="bg-transparent outline-none w-full text-gray-800"
            />
          </div>
        </div>

        <div className="flex items-center  p-2  rounded-3xl bg-[#f5f5f5] border border-gray-300 shadow-md">
          <FaEnvelope className="text-gray-500 mr-2 " />
          <span className="text-red-500">*</span>

          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full outline-none text-[#4a4a4a]"
          />
        </div>

        <div className="md:flex space-x-4 w-full md:space-y-0 space-y-4">
          <div className="md:w-[50%] w-full flex items-center bg-[#f5f5f5] p-2 rounded-3xl border border-gray-300 shadow-md">
            <FaMobile className="text-gray-500 mr-2" />
            <span className="text-red-500">*</span>
            <input
              required
              type="number"
              name="mobile"
              placeholder="Mobile No"
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
          <div className="flex items-center md:w-[50%]  p-2  rounded-3xl bg-[#f5f5f5] border border-gray-300 shadow-md w-full">
            <FaWhatsapp className="text-gray-500 mr-2" />
            <input
              type="number"
              name="whatsapp"
              placeholder="WhatsApp No"
              onChange={handleChange}
              value={formData.whatsapp}
              className="w-full outline-none text-[#4a4a4a]"
            />
            <input
              type="checkbox"
              checked={
                formData.mobile ? formData.mobile === formData.whatsapp : ""
              }
              onChange={whatsappCheckBox}
            />
          </div>
        </div>

        <div className="md:flex space-x-4 w-full md:space-y-0 space-y-4">
          <div className="md:w-[60%] w-full flex items-center bg-[#f5f5f5] p-2 rounded-3xl border border-gray-300 shadow-md">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="peer mt-1 block w-full outline-none text-[#4a4a4a] "
            >
              <option value="">State</option>
              {stateNames.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="flex md:w-[35%] items-center p-2  rounded-3xl bg-[#f5f5f5] border border-gray-300 shadow-md w-full">
            <FaKey className="text-gray-500 mr-2" />
            <input
              type="text"
              name="pinCode"
              placeholder="Pin Code"
              onChange={handleChange}
              className="w-full outline-none text-[#4a4a4a]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center p-2  rounded-3xl bg-[#f5f5f5] border border-gray-300 shadow-md w-full">
            <LiaAddressCardSolid className="text-gray-500 mr-2" />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="w-full outline-none text-[#4a4a4a]"
            />
          </div>
        </div>

        <div className="md:flex space-x-4 w-full md:space-y-0 space-y-4">
          <div className="md:w-[60%] w-full flex items-center bg-[#f5f5f5] p-2 rounded-3xl border border-gray-300 shadow-md">
            <FaBuilding className="text-gray-500 mr-2" />
            <input
              type="text"
              name="collegeName"
              placeholder="College Name"
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
          <div className="flex items-center  md:w-[35%] p-2  rounded-3xl bg-[#f5f5f5] border border-gray-300 shadow-md w-full">
            <FaUniversity className="text-gray-500 mr-2" />
            <span className="text-red-500">*</span>

            <select
              required
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="peer mt-1 block w-full outline-none text-[#4a4a4a] "
            >
              <option value="">Stream</option>
              {yearOfCollage.map((year, index) => (
                <option key={index} value={year.value}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center  p-2  rounded-3xl bg-[#f5f5f5] border border-gray-300 shadow-md">
          <FaLock className="text-gray-500 mr-2" />
          <span className="text-red-500">*</span>

          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            placeholder="Add Password"
            onChange={handleChange}
            className="w-full outline-none text-[#4a4a4a]"
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          <span
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-500" />
            ) : (
              <FaEye className="text-gray-500" />
            )}
          </span>
        </div>
        {isPasswordFocused && (
          <ul className="text-sm mt-2 list-disc pl-5">
            {passwordRequirements.map((req, index) => (
              <li
                key={index}
                className={
                  req.test(formData.password)
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {req.message}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center  p-2  rounded-3xl bg-[#f5f5f5] border border-gray-300 shadow-md">
          <FaLock className="text-gray-500 mr-2" />
          <span className="text-red-500">*</span>

          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full outline-none text-[#4a4a4a]"
          />
        </div>

        <div className="flex items-center space-x-2 ml-[1vw]">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          />
          <p className="text-gray-600 text-sm">
            I accept the{" "}
            <span className="text-blue-600">
              <Link to="/termsandconditions">Terms Of Use</Link>
            </span>{" "}
            &{" "}
            <span className="text-blue-600">
              {" "}
              <Link to="/privacypolicy">Privacy Policy</Link>
            </span>
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className={`${
              termsAccepted
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            } text-white font-semibold py-2 rounded-lg w-[150px] transition`}
            disabled={!termsAccepted}
          >
            Register
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-4 mb-12 text-center">
          Already have an account? <br />
          <Link
            to="/user_signin"
            className="text-blue-600 font-semibold cursor-pointer"
          >
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EngineeringForm;
