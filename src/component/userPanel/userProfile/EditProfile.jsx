import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import female from "../../../assets/userProfilePage/female avatar.jpg";
import male from "../../../assets/userProfilePage/male.png";
import UserProfilePage from "../../../pages/userPanelPages/UserProfilePage";
import { EditProfileSchema } from "../../../schema/EditProfile";

const EditProfile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("userAccess");

  const location = useLocation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: location.state?.name || "",
      email: location.state?.email || "",
      phoneNumber: location.state?.phoneNumber || "",
      whatsappNumber: location.state?.whatsappNumber || "",
      schoolName: location.state?.schoolName || "",
      address: location.state?.address || "",
      studentClass: location.state?.studentClass || "",
      program: location.state?.program || "",
      gender: location.state?.gender || "",
      dob: location.state?.dob || "",
      state: location.state?.state || "",
      pincode: location.state?.pincode || "",
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/user/student/edit-profile/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: values.email,
              phone_number: values.phoneNumber || null,
              alternate_phone: values.whatsappNumber || null,
              date_of_birth: values.dob || null,
              // school: 1,
              address_line1: values.address || null, // simplified (you can split later)
              gender: values.gender,
              full_name: values.name, // if API supports full_name
              state: values.state,
              pincode: values.pincode,
            }),
          }
        );

        if (response.ok) {
          toast.success("Successfully Edited Profile");
          navigate("/user_profile");
        } else {
          toast.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error editing details:", error);
        toast.error("Something went wrong");
      }
    },
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

  const backButton = () => {
    navigate(-1);
  };

  return (
    <div className="w-full relative h-full">
      <div className="opacity-45">
        <UserProfilePage />
      </div>
      <div className="absolute md:top-[5%] md:left-[30%] top-[15%] left-0 md:w-[35vw] md:min-h-[45vw] min-h-[10vw] bg-[#BDBDBD] p-[2vw] shadow-md rounded-md space-y-3">
        {/* Avatar */}
        <div className="w-full flex items-center text-[2vw] justify-center  text-[#4a4a4a]">
          <div className="w-40 h-40 bg-[#ffecd1] rounded-full">
            {formik.values.gender?.toLowerCase() === "female" ? (
              <img
                src={female}
                alt="User Profile"
                className="w-full h-full rounded-full"
              />
            ) : (
              <img
                src={male}
                alt="User Profile"
                className="w-full h-full rounded-full"
              />
            )}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex justify-between">
            <div className="flex flex-col w-[45%]">
              <label className="font-bold">Full Name</label>
              <input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw] md:p-[1vw]"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="w-[45%]">
              <label className="font-bold">DOB</label>
              <input
                type="date"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw] md:p-[1vw]"
              />
              {formik.touched.dob && formik.errors.dob && (
                <p className="text-red-500 text-sm">{formik.errors.dob}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col w-[45%]">
              <label className="font-bold">Email</label>
              <input
                readOnly
                name="email"
                value={formik.values.email}
                className="w-full outline-none border-b-[0.1vw] cursor-not-allowed md:mt-[0.5vw] md:h-[2vw] md:p-[1vw]"
              />
            </div>

            <div className="w-[45%]">
              <label className="font-bold">Mobile No.</label>
              <input
                name="phoneNumber"
                type="tel"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw] md:p-[1vw]"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-[45%]">
              <label className="font-bold">Whatsapp No.</label>
              <input
                name="whatsappNumber"
                type="tel"
                value={formik.values.whatsappNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw] md:p-[1vw]"
              />
              {formik.touched.whatsappNumber &&
                formik.errors.whatsappNumber && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.whatsappNumber}
                  </p>
                )}
            </div>

            <div className="flex flex-col w-[20%]">
              <label className="font-bold">Gender</label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw]"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold">School</label>
            <input
              name="schoolName"
              value={formik.values.schoolName}
              onChange={formik.handleChange}
              className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw] md:p-[1vw] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-bold">Address</label>
            <input
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw] md:p-[1vw]"
            />
          </div>

          <div className="flex justify-between">
            <div className="w-[45%]">
              <label className="font-bold">State</label>
              <select
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw]"
              >
                <option value="">Select State</option>
                {stateNames.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[45%]">
              <label className="font-bold">Pincode</label>
              <input
                name="pincode"
                type="number"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                className="w-full outline-none border-b-[0.1vw] md:mt-[0.5vw] md:h-[2vw] md:p-[1vw]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-around mt-6">
            <button
              type="button"
              onClick={backButton}
              className="bg-red-400 text-white px-6 py-2 rounded-lg"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={Object.keys(formik.errors).length > 0}
              className={`${
                Object.keys(formik.errors).length > 0
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500"
              } text-white px-6 py-2 rounded-lg`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
