import React, { useState } from "react";
import toast from "react-hot-toast";
import { User, Hash, Mail, Phone, MapPin, Building, Home } from "lucide-react";

const AddSchool = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    school_name: "",
    school_code: "",
    email: "",
    phone_number: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    school_type: "",
    board_affiliation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/admin/register-school/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("School added successfully!");
        setFormData({
          school_name: "",
          school_code: "",
          email: "",
          phone_number: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          school_type: "",
          board_affiliation: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add school");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-start p-6 min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center">
          Add New College
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* College Name */}
          <div className="relative col-span-1 md:col-span-2">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              College Name
            </label>
          </div>

          {/* College Code */}
          <div className="relative">
            <Hash className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="school_code"
              value={formData.school_code}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              College Code
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              Email
            </label>
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              Phone Number
            </label>
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              City
            </label>
          </div>

          {/* State */}
          <div className="relative">
            <Building className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              State
            </label>
          </div>

          {/* Country */}
          <div className="relative">
            <Home className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              Country
            </label>
          </div>

          {/* Pincode */}
          <div className="relative">
            <Hash className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              Pincode
            </label>
          </div>

          {/* College Type */}
          <div className="relative">
            <Building className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="school_type"
              value={formData.school_type}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              College Type
            </label>
          </div>

          {/* Board Affiliation */}
          <div className="relative">
            <Building className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="board_affiliation"
              value={formData.board_affiliation}
              onChange={handleChange}
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm 
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              Board Affiliation
            </label>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg cursor-pointer"
            >
              Add College
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchool;
