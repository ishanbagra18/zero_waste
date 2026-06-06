import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdLogin,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendor");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:3002/api/users/login", {
        email,
        password,
        role,
      });
      const { token, user } = res.data;
      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      toast.success("Login successful!");
      if (user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (user.role === "NGO") {
        navigate("/ngo/dashboard");
      } else if (user.role === "Volunteer") {
        navigate("/volunteer/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#232946] relative flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/a8/97/a4/a897a4cafe9f0c5bbca4c81945741e4d.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Left Section */}
        <div className="md:w-1/2 p-8 md:p-12 space-y-6 flex flex-col justify-center bg-gradient-to-tr from-[#262c4a] via-[#111827] to-black text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Flip the Waste <span className="text-green-400">Script</span>
          </h1>
          <h2 className="text-2xl text-green-200 font-medium">
            ♻️ Turning surplus into support, one item at a time.
          </h2>
          <p className="text-lg text-gray-300 italic">
            "One platform. Zero waste. Infinite impact." <br />
            "We don’t just manage waste — we rewrite its story."
          </p>
        </div>

        {/* Right Section - Login Form */}
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 w-full bg-black/80 backdrop-blur-lg border-l border-white/10 p-8 space-y-7 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-extrabold text-center text-green-400">
            Login
          </h2>

          {error && (
            <div className="bg-red-900/30 border border-red-600 text-red-300 text-sm px-4 py-2 rounded text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-3 rounded-lg border border-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
            <MdEmail className="text-green-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent flex-1 outline-none placeholder-gray-400 text-white"
              autoComplete="off"
            />
          </div>
          {/* Password */}
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-3 rounded-lg border border-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
            <MdLock className="text-green-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent flex-1 outline-none placeholder-gray-400 text-white"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="focus:outline-none text-gray-400 hover:text-green-400"
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {/* Role */}
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-3 rounded-lg border border-gray-700 focus-within:ring-2 focus-within:ring-green-400 transition">
            <MdPerson className="text-green-400" />
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white"
            >
              <option value="vendor" className="bg-gray-900 text-white">
                Vendor
              </option>
              <option value="NGO" className="bg-gray-900 text-white">
                NGO
              </option>
              <option value="Volunteer" className="bg-gray-900 text-white">
                Volunteer
              </option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 font-bold text-white rounded-xl shadow-lg text-lg tracking-wide transition"
          >
            <MdLogin size={20} />
            Login
          </button>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-green-400 font-semibold hover:underline"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
