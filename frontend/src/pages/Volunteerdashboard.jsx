import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

const volunteerImg = 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=800&q=80';
const bookingsImg = 'https://cdn.dribbble.com/users/458522/screenshots/16656053/media/f2de1b409d0b2163b3b804a37a5f2c55.gif';

const Volunteerdashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100 flex flex-col font-sans relative">
      {/* Notification Bell Icon */}
      <div className="absolute top-6 right-6 z-50">
        <Link to="/notifications" className="relative group">
          <Bell className="w-7 h-7 text-gray-300 hover:text-white transition duration-200" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
            !
          </span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-32 gap-16 flex-grow">
        {/* Text Content */}
        <div className="text-center md:text-left max-w-xl space-y-7">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-500 to-green-400 text-transparent bg-clip-text drop-shadow-lg">
            Welcome to VolunteerHub
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Empower your volunteer journey. Discover opportunities, track your impact, and connect with communities that care.
          </p>
          <div className="flex justify-center md:justify-start gap-6">
            <a
              href="#getstarted"
              className="px-8 py-3 bg-indigo-600 rounded-full font-semibold hover:bg-indigo-700 shadow-lg transition"
            >
              Get Started
            </a>
            <Link
              to="/myprofile"
              className="px-8 py-3 border border-indigo-500 rounded-full font-semibold hover:bg-indigo-700 hover:text-white transition"
            >
              My Profile
            </Link>
          </div>
        </div>
        {/* Image */}
        <div className="max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
          <img
            src={volunteerImg}
            alt="Volunteering teamwork"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </section>

      {/* Bookings Section */}
      <section className="relative py-20 px-6 md:px-24 bg-[#111827] border-t border-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md md:max-w-lg group">
              <img
                src="/bookings.gif"
                alt="Volunteer booking illustration"
                className="w-full h-auto object-cover shadow-2xl transition-all duration-500 group-hover:scale-105"
                style={{
                  clipPath:
                    "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)",
                  border: "3px solid #4f46e5",
                }}
              />
              <div className="absolute inset-0 pointer-events-none rounded-xl shadow-inner opacity-10 group-hover:opacity-20 transition" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-5 max-w-xl text-center md:text-left">
            <h2 className="text-4xl font-bold text-white leading-tight">
              🚐 Manage Your Volunteer Bookings
            </h2>
            <p className="text-gray-400 text-lg">
              View your assigned bookings, confirm availability, and manage your upcoming transportation duties.
            </p>
            <Link
              to="/allbookings"
              className="inline-block px-6 py-3 text-white bg-green-600 hover:bg-green-700 font-medium text-lg rounded-full shadow-lg transition duration-300"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-700 text-gray-500 text-sm backdrop-blur-sm bg-gray-900/60">
        © 2025 VolunteerHub. Crafted with care and purpose.
      </footer>
    </div>
  );
};

export default Volunteerdashboard;
