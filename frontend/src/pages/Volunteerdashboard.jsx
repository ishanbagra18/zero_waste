import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';

const volunteerImg = 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=800&q=80';

const Volunteerdashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#12132B] via-[#21182f] via-70% to-[#18067a] text-gray-100 flex flex-col font-sans relative overflow-x-hidden">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-sky-500 to-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>

      {/* Navbar */}
      <nav className="w-full z-50 px-6 sm:px-12 py-5 flex items-center justify-between bg-transparent backdrop-blur-md bg-white/5 border-b border-indigo-500/10 shadow-md fixed top-0">
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-pink-400 via-indigo-400 to-green-400 bg-clip-text text-transparent">
          VolunteerHub
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link to="/" className="hover:text-pink-400 transition">Dashboard</Link>
          <Link to="/allbookings" className="hover:text-green-400 transition">Bookings</Link>
          <Link to="/myprofile" className="hover:text-indigo-400 transition">Profile</Link>
          <Link to="/notifications" className="relative group ml-4">
            <Bell className="w-6 h-6 text-indigo-300 hover:text-white transition duration-150" />
            <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow">
              !
            </span>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Link to="/notifications" className="relative group">
            <Bell className="w-6 h-6 text-indigo-300 hover:text-white transition duration-150" />
            <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow">
              !
            </span>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 right-6 bg-[#1f2235] border border-indigo-500/20 rounded-lg px-6 py-4 shadow-xl z-50 flex flex-col gap-4 md:hidden">
            <Link to="/" className="hover:text-pink-400 transition" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link to="/allbookings" className="hover:text-green-400 transition" onClick={() => setIsMenuOpen(false)}>Bookings</Link>
            <Link to="/myprofile" className="hover:text-indigo-400 transition" onClick={() => setIsMenuOpen(false)}>Profile</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 py-44 gap-20 flex-grow w-full relative z-10">
        {/* Text Content */}
        <div className="text-center md:text-left max-w-xl space-y-9">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-tr from-indigo-400 via-pink-500 to-green-400 text-transparent bg-clip-text drop-shadow-2xl tracking-tight leading-[1.1]">
            Welcome to VolunteerHub
          </h1>
          <p className="text-2xl md:text-xl text-gray-300/90 leading-relaxed font-medium drop-shadow">
            Empower your volunteer journey. Discover opportunities, track your impact, and connect with communities that care.
          </p>
          <div className="flex justify-center md:justify-start gap-8 pt-2">
            <Link
              to="/volunteerhub"
              className="px-9 py-3.5 bg-gradient-to-br from-indigo-600 via-fuchsia-700 to-pink-500 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition transform hover:bg-gradient-to-bl outline-none focus:ring-2 focus:ring-pink-400"
            >
              Get Started
            </Link>
            <Link
              to="/myprofile"
              className="px-8 py-3 border-2 border-indigo-400 rounded-full font-bold text-lg text-indigo-100 bg-white/5 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-md transition"
            >
              My Profile
            </Link>
          </div>
        </div>
        {/* Image */}
        <div className="max-w-md w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-indigo-400/40 bg-white/10 backdrop-blur-xl relative hover:scale-105 transition-all duration-700">
          <img
            src={volunteerImg}
            alt="Volunteering teamwork"
            className="object-cover w-full h-full scale-105 hover:scale-110 transition-all duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="relative py-20 px-4 sm:px-16 md:px-32 bg-[#161822] border-t border-indigo-800/50 shadow-2xl rounded-t-3xl mt-12 overflow-hidden backdrop-blur-xl z-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/mocha.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-32 right-10 w-80 h-80 bg-gradient-to-tr from-pink-600 to-fuchsia-400 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-14 max-w-7xl mx-auto">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-[340px] group">
              <img
                src="/bookings.gif"
                alt="Volunteer booking illustration"
                className="w-full h-full object-cover shadow-2xl group-hover:scale-105 transition-all duration-500 border-[4px] border-indigo-600 rounded-[30%_70%_74%_26%_/_30%_24%_76%_70%]"
              />
              <div className="absolute inset-0 pointer-events-none rounded-xl shadow-inner opacity-30 group-hover:opacity-50 transition" />
            </div>
          </div>
          {/* Text */}
          <div className="space-y-7 max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 via-indigo-400 to-pink-400 text-transparent bg-clip-text drop-shadow-xl leading-tight">
              🚐 Manage Your Bookings
            </h2>
            <p className="text-gray-200/85 text-xl font-medium drop-shadow">
              View your assigned bookings, confirm availability, and manage your upcoming transportation duties.
            </p>
            <Link
              to="/allbookings"
              className="inline-block px-8 py-4 text-white font-bold text-lg bg-gradient-to-tr from-green-500 via-indigo-500 to-pink-400 hover:from-indigo-600 hover:to-green-600 rounded-full shadow-xl hover:scale-105 transition duration-200"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-indigo-500/40 text-gray-400 text-md font-medium tracking-wide bg-gray-900/70 shadow-inner backdrop-blur-2xl rounded-b-3xl">
        © 2025 <span className="font-bold text-indigo-300">VolunteerHub</span>. Crafted with care and purpose.
      </footer>
    </div>
  );
};

export default Volunteerdashboard;
