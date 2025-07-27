// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch('http://localhost:3002/api/users/forgot-password', {
        email,
        role,
        newPassword: password,
      });

      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f172a] p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-2">Reset Password</h2>
        <p className="text-sm text-gray-400 text-center">Please fill in the details below</p>

        {/* Email */}
        <div className="relative">
          <MdEmail className="absolute top-3.5 left-3 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full py-3 pl-10 pr-4 bg-[#1e293b] text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Role */}
        <div className="relative">
          <MdPerson className="absolute top-3.5 left-3 text-gray-400" size={20} />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full py-3 pl-10 pr-4 bg-[#1e293b] text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select your role</option>
            <option value="NGO">NGO</option>
            <option value="vendor">vendor</option>
            <option value="Volunteer">Volunteer</option>
          </select>
        </div>

        {/* New Password */}
        <div className="relative">
          <MdLock className="absolute top-3.5 left-3 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full py-3 pl-10 pr-4 bg-[#1e293b] text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold rounded-xl shadow-md"
        >
          Reset Password
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-green-400">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
