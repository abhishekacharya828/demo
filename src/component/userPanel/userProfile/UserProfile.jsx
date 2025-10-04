import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import emailIcon from "../../../assets/userPanel/Email.png";
import mobileIcon from "../../../assets/userPanel/Mobile.png";
import female from "../../../assets/userProfilePage/female avatar.jpg";
import male from "../../../assets/userProfilePage/male.png";

const UserProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  // ✅ Use backend URL from .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Function to calculate age safely
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("userAccess");
        if (!token) {
          console.error("No access token found in localStorage");
          return;
        }

        const response = await fetch(`${backendUrl}/api/user/students/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const student = Array.isArray(data) ? data[0] : data;
          setStudentData(student);
          localStorage.setItem("studentData", JSON.stringify(student));
        } else {
          console.error("Failed to fetch student data", response.status);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudent();
  }, [backendUrl]);

  const onclickEdit = () => {
    if (!studentData) return;
    navigate("/user_profile/edit", {
      state: {
        name: `${studentData.first_name || ""} ${
          studentData.middle_name || ""
        } ${studentData.last_name || ""}`.trim(),
        email: studentData.email,
        phoneNumber: studentData.phone_number,
        whatsappNumber: studentData.alternate_phone,
        schoolName: studentData.school,
        address: `${studentData.address_line1 || ""} ${
          studentData.address_line2 || ""
        } ${studentData.city || ""}`.trim(),
        studentClass: studentData.branch,
        gender: studentData.gender,
        dob: studentData.date_of_birth,
        state: studentData.state,
        pincode: studentData.pincode,
        program: studentData.program,
      },
    });
  };

  if (!studentData) return <p>Loading...</p>;

  const fullName = `${studentData.first_name || ""} ${
    studentData.middle_name || ""
  } ${studentData.last_name || ""}`.trim();

  const address = `${studentData.address_line1 || ""} ${
    studentData.address_line2 || ""
  } ${studentData.city || ""}`.trim();

  return (
    <div className="p-4 rounded-lg flex items-start space-x-4 md:w-full">
      <div className="flex flex-col-reverse md:flex-row justify-between w-full px-[1vw]">
        <div className="text-[#000000] md:w-[70vw] md:min-h-[8vw] flex flex-col gap-[0.1vw] tracking-wide">
          <h2 className="capitalize header-font md:text-[2.3vw] text-[5vw] tracking-wider text-black ">
            {fullName}
          </h2>
          <div className="flex gap-10">
            <div className="md:min-w-[10vw]">
              <h3 className="font-regular">
                <span className="font-bold">Age -</span>{" "}
                {calculateAge(studentData.date_of_birth)}
              </h3>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="md:min-w-[5vw]">
              <h3 className="font-regular">
                <span className="font-bold">Branch -</span> {studentData.branch}
              </h3>
            </div>
          </div>
          <div className="flex md:min-w-[25vw] items-start gap-[0.5vw]">
            <h3 className="font-regular">
              <span className="font-bold">School :</span> {studentData.school}
            </h3>
          </div>
          <div className="md:min-w-[30vw]">
            <h3 className="font-regular">
              <span className="font-bold">Address :</span> {address || "N/A"}
            </h3>
          </div>
          <h3 className="font-regular">
            <span className="font-bold">State :</span> {studentData.state}
          </h3>
          <h3 className="font-regular">
            <span className="font-bold">Pincode :</span> {studentData.pincode}
          </h3>
          <div className="flex flex-wrap gap-3 text-[#545454] font-semibold mt-4">
            {studentData.email && (
              <span className="flex items-center rounded-sm px-3 py-1 space-x-2 shadow-md text-xs md:text-sm border">
                <img src={emailIcon} alt="Email" className="w-4 h-4" />
                <p>{studentData.email}</p>
              </span>
            )}
            <span className="flex items-center space-x-2 px-3 py-1 rounded-sm text-xs md:text-sm shadow-md border">
              <img src={mobileIcon} alt="Mobile" className="w-4 h-4" />
              <p>+91 {studentData.phone_number || "Provide Phone No."}</p>
            </span>

            <span className="flex items-center space-x-2 px-3 py-1 rounded-sm text-xs md:text-sm shadow-md border">
              <FaWhatsapp className="text-base md:text-[1.2vw]" />
              <p>+91 {studentData.alternate_phone || "Provide WhatsApp No."}</p>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-[1vw]">
          <div className="w-40 h-40 bg-[#BDBDBD] rounded-full">
            {studentData.gender?.toLowerCase() === "female" ? (
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
          <button
            onClick={onclickEdit}
            className="flex items-center text-md text-[#ffffff] bg-[#19b2e9] px-4 py-2 rounded-sm text-md"
          >
            <span className="md:text-[0.9vw]">Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
