import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("vendor");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setError("Please upload a photo.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("organisation", organisation);
    formData.append("location", location);
    formData.append("role", role);
    formData.append("password", password);
    formData.append("photo", photo);

    try {
      const res = await axios.post(
        "https://zero-waste-2xxf.onrender.com/api/users/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const { token, user } = res.data;
      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      toast.success("Registration successful!");
      if (user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (user.role === "NGO") {
        navigate("/ngo/dashboard");
      } else if (user.role === "Volunteer") {
        navigate("/volunteer/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#111827] via-black to-[#22223b]">
      <div className="flex w-full max-w-5xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-black/70 backdrop-blur-lg border border-white/10">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-between w-2/5 bg-gradient-to-tr from-[#262c4a] via-[#111827] to-black p-10 relative">
          <svg
            className="absolute bottom-0 left-0 text-white opacity-5"
            width="280"
            height="140"
            fill="none"
            viewBox="0 0 260 140"
          >
            <circle cx="50" cy="90" r="90" fill="currentColor" />
          </svg>
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-800/50 flex items-center justify-center">
                <span className="text-3xl text-green-400">♻️</span>
              </div>
              <span className="font-bold text-lg text-green-100 tracking-wider">
                ZeroWaste
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight drop-shadow-lg mb-4">
              Join the <span className="text-green-400">Zero Waste</span>
              <br /> Movement
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Be a part of the solution. Connect surplus to those in need.
              Reduce waste. Create value. Empower communities.
            </p>
            <ul className="text-gray-400 space-y-2 text-sm mt-4">
              <li>♻️ Turning surplus into support — one item at a time</li>
              <li>🌍 Location: Global</li>
              <li>🏷️ Role: Vendor / NGO</li>
            </ul>
          </div>
          <div className="text-xs text-gray-400 mt-10">
            &copy; {new Date().getFullYear()} ZeroWaste. All rights reserved.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-3/5 flex items-center justify-center bg-black/80 backdrop-blur-2xl">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="w-full px-8 py-12 md:px-10 md:py-16 max-w-md mx-auto space-y-8 rounded-2xl shadow-xl"
          >
            <div className="mb-6">
              <div className="flex flex-col items-center mb-2">
                <div className="w-16 h-16 bg-green-900/40 rounded-full flex items-center justify-center shadow-lg mb-1">
                  <span className="text-3xl text-green-400">🌱</span>
                </div>
                <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-green-400 tracking-tight">
                  Register
                </h2>
              </div>
              <p className="text-gray-400 mt-2 text-center">
                Start your Zero Waste journey
              </p>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-600 text-red-300 text-sm px-4 py-2 rounded text-center font-medium mb-4 animate-pulse">
                {error}
              </div>
            )}

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 bg-gray-900 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-green-400 placeholder-gray-500 transition outline-none"
                autoComplete="off"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 bg-gray-900 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-green-400 placeholder-gray-500 transition outline-none"
                autoComplete="off"
              />
              <input
                type="number"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 bg-gray-900 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-green-400 placeholder-gray-500 transition outline-none"
                autoComplete="off"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 bg-gray-900 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-green-400 placeholder-gray-500 transition outline-none"
                autoComplete="off"
              />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <input
                type="text"
                placeholder="Organisation"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 bg-gray-900 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-green-400 placeholder-gray-500 transition outline-none"
                autoComplete="off"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg px-4 py-3 bg-gray-900 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-green-400 transition"
              >
                <option value="vendor">Vendor</option>
                <option value="NGO">NGO</option>
                <option value="Volunteer">Volunteer</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 bg-gray-900 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-green-400 placeholder-gray-500 transition outline-none"
                autoComplete="off"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                required
                className="w-full text-gray-100 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-green-600 file:text-white file:font-semibold hover:file:bg-green-800 bg-gray-900 rounded-lg px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition font-bold text-white rounded-xl shadow-md text-lg tracking-wide"
            >
              Register Now
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a href="/" className="text-green-400 font-bold hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
