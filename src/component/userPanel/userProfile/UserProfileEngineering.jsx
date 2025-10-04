import React, { useContext, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import female from "../../../assets/userProfilePage/female avatar.jpg";
import male from "../../../assets/userProfilePage/male.png";
import email from "../../../assets/userPanel/Email.png";
import mobile from "../../../assets/userPanel/Mobile.png";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSchool } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaWhatsapp } from "react-icons/fa";

const UserProfileEngineering = () => {
  const { userData, setStudentData, studentData, tokens } =
    useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  console.log("firststudent", studentData);

  useEffect(() => {
    const fetchStudent = async (e) => {
      try {
        const response = await fetch(`${backendUrl}/user/${userData.userid}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens} `,
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("studentData", JSON.stringify(data));
          setStudentData(data);
        }
      } catch (error) {
        console.error("Error Fetching StudentDetails:", error);
      }
    };
    if (userData?.userid) {
      fetchStudent();
    }
  }, [backendUrl, userData, tokens]);

  const onclickEdit = () => {
    navigate("/editprofile", {
      state: {
        name: studentData.full_name,
        email: studentData.email,
        phoneNumber: studentData.mob_no,
        schoolName: studentData.school_or_college_name,
        address: studentData.address,
        studentClass: studentData.class_or_branch,
        whatsappNumber: studentData.wp_no,
        program: studentData.role,
        gender: studentData.gender,
        dob: studentData.dob,
        state: studentData.state,
        pincode: studentData.pincode,
      },
    });
  };

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    // Calculate the age by comparing the year, month, and day
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the birth date hasn't occurred yet this year, subtract one from age
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  return (
    <>
      <div className="p-4 rounded-lg flex flex-row-reverse justify-end   items-start space-x-4 md:w-full">
        {/* Profile Image */}
        <div className="flex flex-col-reverse md:flex-row justify-between w-full px-[1vw]">
          {/* User Info */}
          <div className=" text-[#000000]  md:w-[70vw] md:min-h-[8vw] flex flex-col gap-[0.1vw] tracking-wide">
            <h2 className=" capitalize header-font md:text-[1.5vw]  tracking-wider text-[5vw] text-black">
              {studentData.full_name}
            </h2>
            {/* <h3>DOB - {studentData.dob} ,</h3> */}
            <div className="flex gap-10">
              <div className="md:min-w-[10vw]">
                <h3 className="font-regular">
                  <span className="font-bold">Age -</span>{" "}
                  {studentData.dob?calculateAge(studentData.dob):""}
                </h3>
              </div>
            </div>
            <div className="flex gap-10">
              <h3 className="font-regular">
                <span className="font-bold">Stream -</span>{" "}
                {studentData.class_or_branch == 9 && "BCA"}{" "}
                {studentData.class_or_branch == 10 && "MCA"}{" "}
                {studentData.class_or_branch == 11 && "B.TECH"}{" "}
                {studentData.class_or_branch == 12 && "M.TECH"}
              </h3>
            </div>
            <div className="flex md:min-w-[25vw] items-start   gap-[0.5vw]">
              {/* <FaSchool className="text-black text-[1.4vw]" /> */}
              <h3 className="font-regular">
                <span className="font-bold">College Name :</span>{" "}
                {studentData.school_or_college_name}
              </h3>
            </div>
            <div className=" md:min-w-[30vw]">
            <h3 className="font-regular">
                <span className="font-bold">Address :</span>{" "}
                {studentData.address}
              </h3>
            </div>
            <h3 className="font-regular">
              {" "}
              <span className="font-bold">State :</span> {studentData.state}
            </h3>
            <h3 className="font-regular">
              <span className="font-bold">Pincode :</span> {studentData.pincode}{" "}
            </h3>
            {/* Contact Info */}
            <div className="flex items-center flex-wrap gap-[2vw] text-[#545454] font-semibold space-x-3 mt-4 ">
              <span className="flex items-center rounded-sm px-3 py-1 space-x-2 shadow-md text-sm border">
                <img src={email} alt="Email" className="w-4 h-4" />
                <p>{studentData.email}</p>
              </span>
              <span className="flex items-center space-x-2 px-3 py-1 rounded-sm text-sm shadow-md border">
                <img src={mobile} alt="Mobile" className="w-4 h-4" />
                <p>+91 {studentData.mob_no}</p>
              </span>
              <span className="flex items-center space-x-2 px-3 py-1 rounded-sm text-sm shadow-md border">
                {/* <img src={mobile} alt="Mobile" className="w-4 h-4" /> */}
                <FaWhatsapp className="md:text-[1.2vw]" />
                <p>+91 {studentData.wp_no}</p>
              </span>
            </div>
          </div>
          <div className=" flex flex-col items-center justify-center gap-[1vw]">
            <div className="w-40 h-40 bg-[#ffecd1] rounded-full">
              {studentData.gender === "Female" ? (
                <img
                  src={female}
                  alt="User Profile"
                  className="w-full h-full  rounded-full"
                />
              ) : (
                <img
                  src={male}
                  alt="User Profile"
                  className="w-full h-full  rounded-full"
                />
              )}
            </div>
            {/* Edit Profile Button */}

            <button
              onClick={onclickEdit}
              className="flex items-center text-md text-[#ffffff] bg-blue-500   px-4 py-2 rounded-sm text-md"
            >
              {/* <FaEdit className="mr-1" /> */}
              <span className="md:text-[0.9vw]">Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="md:mt-[2vw] md:ml-[2vw] ml-[4vw] mt-[4vw]">
        <div className="flex md:flex-row flex-col md:gap-[1vw] gap-[2vw] bg-[#EDECEC]  rounded-lg w-[90%] md:p-[0.5vw] p-[1vw] text-center items-center justify-evenly">
          <p className="md:text-[2vw] text-[#92278E]">
            Free Trial Test{" "}
            <span className="md:mx-[1vw] text-[#92278E] md:text-[1.8vw]">
              |
            </span>{" "}
            <span className="text-[#92278E] md:text-[1.6vw]">
              {" "}
              Transform exams with WaveIQ's AI technology
            </span>
          </p>
          <p></p>
          <button
            onClick={() =>
              navigate("/freetestitems", {
                state: {
                  from: "freetest",
                },
              })
            }
            className="md:py-[0.5vw] cursor-pointer md:px-[1vw] py-[1vw] px-[3vw] bg-[#19b2e9] rounded-lg text-[#ffffff]"
          >
            Start Test
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfileEngineering;
