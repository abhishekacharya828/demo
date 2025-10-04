import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock, Mail, Phone, Building, Eye, EyeOff } from "lucide-react";

const EditCollegeAdmin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    school: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch schools for dropdown
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/admin/schools/`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setSchools(data);
        }
      } catch (err) {
        toast.error("Failed to load schools");
      }
    };
    fetchSchools();
  }, [backendUrl]);

  // Fetch admin details
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/admin/schools/${id}/`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch admin data");
        const data = await res.json();
        setFormData({
          email: data.email || "",
          password: "", // Don't prefill password
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          school: data.school || "",
          phone_number: data.phone_number || "",
        });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [backendUrl, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/api/admin/college-admins/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update admin");
      }

      toast.success("College Admin updated successfully!");
      navigate("/admin_dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <p className="p-4">Loading admin data...</p>;

  return (
    <div className="flex justify-center items-start p-6 min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center">
          Edit College Admin
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              First Name
            </label>
          </div>

          {/* Last Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              Last Name
            </label>
          </div>

          {/* Email */}
          <div className="relative col-span-1 md:col-span-2">
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

          {/* Phone Number */}
          <div className="relative col-span-1 md:col-span-2">
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

          {/* Password */}
          <div className="relative col-span-1 md:col-span-2">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="peer pl-10 pr-10 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm
              transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              Password (leave blank to keep unchanged)
            </label>
          </div>

          {/* School Selection */}
          <div className="relative col-span-1 md:col-span-2">
            <Building className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              className="peer pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">-- Select a School --</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.school_name}
                </option>
              ))}
            </select>
            <label className="absolute left-10 -top-2 bg-white px-1 text-gray-500 text-sm
              transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
              Select School
            </label>
          </div>

          {/* Submit */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg cursor-pointer"
            >
              Update College Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCollegeAdmin;
