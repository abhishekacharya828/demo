import React, { useContext, useEffect, useState } from "react";
import pickinguserwindow from "../../../assets/userPanel/picking user window.png";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import img1 from "../../../assets/userProfilePage/special-offer-creative-sale-banner-design 1.jpg";
import toast from "react-hot-toast";
import { TbXboxXFilled } from "react-icons/tb";

const ExamRegistration = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { tokens, userData, studentData } = useContext(AuthContext);
  const [courseCode, setCourseCode] = useState([]);

  const [showModal, setShowModel] = useState(false);

  const [paymentLink, setPaymentLink] = useState();

  const role = userData.role === "engineering" ? 2 : 1;
  const [course, setCourse] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponError, setcouponError] = useState(false);
  const [couponsucess, setcouponsucess] = useState({});
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoStatus, setPromoStatus] = useState("");

  const location = useLocation();

  const onchangeCoupon = (e) => {
    setCoupon(e.target.value);
  };

  useEffect(() => {
    if (location.state?.value) {
      setCourseCode((prevData) => {
        if (!prevData.includes(location.state?.value)) {
          return [...prevData, location.state?.value];
        }
        return prevData;
      });
    }
  }, [location.state?.value]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/courses/${role}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
  }, []);

  const handleCourseCode = (e) => {
    const { name, value, checked } = e.target;

    setCourseCode((prevData) => {
      if (checked) {
        return [...prevData, value];
      } else {
        return prevData.filter((course) => course != value);
      }
    });
  };

  const handleCoupon = async () => {
    if (!coupon) {
      return toast.error("Enter Coupon Code");
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/validate_discount_code/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens}`,
          },
          body: JSON.stringify({
            discount_code: coupon,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();

        setcouponsucess(data);
        setPromoStatus("valid");
        setIsPromoApplied(true);
      }

      if (!response.ok) {
        return setPromoStatus("invalid");
      }
    } catch (error) {
      setcouponError(true);
      setPromoStatus("invalid");
    }
  };

  const removeCode = () => {
    setCoupon("");
    setIsPromoApplied(false);
    setPromoStatus("");
  };

  console.log("code", courseCode.sort());
  console.log("coupon obj", couponsucess.valid ? coupon : null);

  const handleProceed = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/create-cashfree-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData?.userid,
          course_codes: courseCode.sort(),
          discount_code: couponsucess.valid && coupon ? coupon : "",
        }),
      });

      if (response.status !== 200) {
        toast.error("Cannot proceed with the payment, Try Again !!");
      }

      if (response.status === 200) {
        const responseData = await response.json();
        setPaymentLink(responseData);
        setShowModel(true);

        console.log("response", responseData);
        console.log("response", responseData.payment_link);
        console.log("response", responseData.order_id);
        localStorage.setItem("order_Id", JSON.stringify(responseData.order_id));
        setPaymentLink(responseData.payment_link);
      }
    } catch (error) {
      toast.error(`Error creating Order:, ${error.error}`);
    }
  };

  const navigateToCashFree = () => {
    const link = document.createElement("a");
    link.href = paymentLink; // Replace `paymentLink` with the actual URL

    document.body.appendChild(link); // Add the link to the DOM
    link.click(); // Simulate a click event
    document.body.removeChild(link); // Clean up by removing the link after clicking
  };

  const price1 = course.find((course) => course.course_code == "OLM001");
  const price2 = course.find((course) => course.course_code == "OLM002");
  const price3 = course.find((course) => course.course_code == "OLM003");
  const price4 = course.find((course) => course.course_code == "OLM004");

  console.log(
    "check",
    (Number(price1?.price) * courseCode.length * couponsucess.discount_value) /
      100
  );

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg">
          <div className="bg-gradient-to-b  from-[#faedcd] via-[#f0c69b] to-[#faedcd] md:w-[30vw] md:min-h-[10vw] absolute top-10 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Proceed To pay !!</h2>
            <p className="mt-2 ">Are sure you want to proceed ?</p>
            <div className="mt-4 flex justify-around gap-0.5">
              <button
                className="bg-blue-500 text-white px-2 py-2 rounded-md w-[30%]"
                onClick={navigateToCashFree}
              >
                Pay
              </button>
              <button
                className="bg-red-500 text-white px-2 py-2 rounded-md w-[30%]"
                onClick={() => setShowModel(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative p-4 rounded-lg w-full mt-[2vw]">
        {/* Background Image with Blending */}
        <img
          src={pickinguserwindow}
          alt="Watermark"
          className="absolute inset-0 md:w-full md:h-[30vw] object-contain  mix-blend-multiply"
        />

        {/* Content */}
        <h2 className="text-lg font-bold mb-3 relative">
          Olympiad Registration & Exam Dates
        </h2>
        <div className="overflow-x-auto w-[90vw] md:w-auto">
          <table className="w-full text-sm text-left border-gray-300 relative">
            <thead>
              <tr className="bg-gray-100 rounded-xl">
                <th className="p-2 whitespace-nowrap">SUBJECT</th>
                <th className="p-2 whitespace-nowrap">ENROLLMENT STATUS</th>
                <th className="p-2 uppercase whitespace-nowrap">
                  Register date
                </th>
                <th className="p-2 whitespace-nowrap">PRICE</th>
                <th className="p-2 whitespace-nowrap">Enroll Multiple</th>
              </tr>
            </thead>
            <tbody className="font-semibold">
              <tr>
                <td className="p-2 whitespace-nowrap">
                  {studentData.course_1 ? (
                    <>
                      <h2> Mathematics Olympiad </h2>
                    </>
                  ) : (
                    <>
                      <h2> Mathematics Olympiad </h2>
                    </>
                  )}
                </td>
                <td className="p-2"> {studentData.course_1 ? "Yes" : "No"}</td>
                <td className="p-2">
                  {studentData.course_1 ? "Registered" : "Not Registered"}
                </td>
                <td className="p-2">
                  {studentData.course_1 ? (
                    "Paid"
                  ) : (
                    <span>₹{price1?.price}</span>
                  )}
                </td>
                <td className="p-2 text-blue-500 cursor-pointer">
                  {studentData.course_1 ? (
                    <>
                      <Link
                        to="/test"
                        state={{
                          name: "Mathematics Olympiad",
                          id: 1,
                        }}
                      >
                        <h2>Start Test</h2>
                      </Link>
                    </>
                  ) : (
                    <>
                      <label className="text-lg">
                        Enroll Now
                        <input
                          type="checkbox"
                          name="Mathematics"
                          value="OLM001"
                          onChange={handleCourseCode}
                          checked={courseCode.includes("OLM001")}
                          className="mr-2 ml-[1vw]"
                        />
                      </label>
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  {studentData.course_2 ? (
                    <>
                      <h2> English Olympiad </h2>
                    </>
                  ) : (
                    <>
                      <h2> English Olympiad </h2>
                    </>
                  )}
                </td>
                <td className="p-2"> {studentData.course_2 ? "Yes" : "No"}</td>
                <td className="p-2">
                  {studentData.course_2 ? "Registered" : "Not Registered"}
                </td>
                <td className="p-2">
                  {studentData.course_2 ? (
                    "Paid"
                  ) : (
                    <span>₹{price2?.price}</span>
                  )}
                </td>
                <td className="p-2 text-blue-500 cursor-pointer">
                  {studentData.course_2 ? (
                    <>
                      <Link
                        to="/test"
                        state={{
                          name: "English Olympiad",
                          id: 2,
                        }}
                      >
                        <h2>Start Test</h2>
                      </Link>
                    </>
                  ) : (
                    <>
                      <label className="text-lg">
                        Enroll Now
                        <input
                          type="checkbox"
                          name="English"
                          value="OLM002"
                          onChange={handleCourseCode}
                          checked={courseCode.includes("OLM002")}
                          className="mr-2 ml-[1vw]"
                        />
                      </label>
                    </>
                  )}
                </td>
              </tr>

              <tr>
                <td className="p-2">
                  {studentData.course_3 ? (
                    <>
                      <h2> Science Olympiad </h2>
                    </>
                  ) : (
                    <>
                      <h2> Science Olympiad </h2>
                    </>
                  )}
                </td>
                <td className="p-2 "> {studentData.course_3 ? "Yes" : "No"}</td>
                <td className="p-2">
                  {studentData.course_3 ? "Registered" : "Not Registered"}
                </td>
                <td className="p-2">
                  {studentData.course_3 ? (
                    "Paid"
                  ) : (
                    <span>₹{price3?.price}</span>
                  )}
                </td>
                <td className="p-2 text-blue-500 cursor-pointer">
                  {studentData.course_3 ? (
                    <>
                      <Link
                        to="/test"
                        state={{
                          name: "Science Olympiad",
                          id: 3,
                        }}
                      >
                        <h2>Start Test</h2>
                      </Link>
                    </>
                  ) : (
                    <>
                      <label className="text-lg">
                        Enroll Now
                        <input
                          type="checkbox"
                          name="Science"
                          value="OLM003"
                          onChange={handleCourseCode}
                          checked={courseCode.includes("OLM003")}
                          className="mr-2 ml-[1vw]"
                        />
                      </label>
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  {studentData.course_4 ? (
                    <>
                      <h2>GK Olympiad</h2>
                    </>
                  ) : (
                    <>
                      <h2> GK Olympiad </h2>
                    </>
                  )}
                </td>
                <td className="p-2"> {studentData.course_4 ? "Yes" : "No"}</td>
                <td className="p-2">
                  {" "}
                  {studentData.course_4 ? "Registered" : "Not Registered"}
                </td>
                <td className="p-2">
                  {studentData.course_4 ? (
                    "Paid"
                  ) : (
                    <span>₹{price4?.price}</span>
                  )}
                </td>
                <td className="p-2 text-blue-500 cursor-pointer">
                  {studentData.course_4 ? (
                    <>
                      <Link
                        to="/test"
                        state={{
                          name: "GK Olympiad",
                          id: 4,
                        }}
                      >
                        <h2>Start Test</h2>
                      </Link>
                    </>
                  ) : (
                    <>
                      <label className="text-lg">
                        Enroll Now
                        <input
                          type="checkbox"
                          name="GK"
                          value="OLM004"
                          onChange={handleCourseCode}
                          checked={courseCode.includes("OLM004")}
                          className="mr-2 ml-[1vw]"
                        />
                      </label>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Section */}

        {courseCode.length > 0 && (
          <>
            <div className="md:w-[28vw] bg-white p-4 rounded-lg shadow-md">
              {/* Promo Code Section */}
              <div
                className={`flex items-center relative  rounded-lg p-2 border ${
                  promoStatus === "valid"
                    ? "border-green-600 border-2 "
                    : promoStatus === "invalid"
                    ? "border-red-600 border-2"
                    : "border-gray-300"
                } `}
              >
                <input
                  // disabled={couponsucess.valid ? true : false}
                  value={coupon}
                  onChange={onchangeCoupon}
                  type="text"
                  placeholder="Promo Code"
                  className={`flex-grow outline-none md:text-[1.2vw] font-extrabold  text-gray-700 bg-transparent relative 
                  
                  `}
                />
                {couponsucess.valid && (
                  <TbXboxXFilled
                    onClick={removeCode}
                    className="text-[1.7vw] text-red-500 mr-[1vw]"
                  />
                )}
                <button
                  onClick={handleCoupon}
                  className="bg-black relative text-white px-4 py-1 rounded-md text-sm"
                >
                  {isPromoApplied ? (
                    <span className="uppercase font-bold">Applied</span>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>

              {/* Order Summary */}
              <div className="mt-4 space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span className="">
                    {" "}
                    ₹{Number(price1?.price) * courseCode.length}
                  </span>
                </div>

                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-medium">
                    ₹
                    {couponsucess.valid && coupon
                      ? (Number(price1?.price) *
                          courseCode.length *
                          couponsucess.discount_value) /
                        100
                      : 0}
                  </span>
                </div>
                <hr className="border-dashed my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    {couponsucess.valid && coupon
                      ? Number(price1?.price) * courseCode.length -
                        (Number(price1?.price) *
                          courseCode.length *
                          couponsucess.discount_value) /
                          100
                      : Number(price1?.price) * courseCode.length}
                  </span>
                </div>
              </div>

              {/* Continue Pay Button */}
              <button
                onClick={handleProceed}
                className="w-full relative bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-lg mt-4 font-medium"
              >
                Continue Pay
              </button>
            </div>
          </>
        )}

        {/* <div>
          <div className="flex items-center justify-center gap-2.5">
            <div>
              <img src={img1} alt="pic" />
            </div>
            <p className="md:text-[1.5vw] header-font capitalize  tracking-wide">
              Get all 4 subjects for just{" "}
              <span className="text-red-400">₹1000</span> ,Save
              <span className="text-green-600"> ₹200</span> !!
            </p>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default ExamRegistration;
