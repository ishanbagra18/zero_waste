import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, Menu, X, LogOut, User, CalendarDays, ThumbsUp,
} from 'lucide-react';
import api from '../util/api';
import { useNavigate } from "react-router-dom";
import Spline from '@splinetool/react-spline';



const Volunteerdashboard = () => {


    const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [volunteers, setVolunteers] = useState([]);



    const handleExploreCommunity = ()=>
  {
    navigate("/blogs")
  }



  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await api.get('/api/users/allvolunteer');// check for errors volunteers count
        const data = response.data
        setVolunteers(data.Volunteer || []);
        console.log(response);
      } catch (error) {
        console.error('Failed to fetch volunteers:', error);
      }
    };

    fetchVolunteers();
  }, []);

  return (
   <div className="min-h-screen w-full bg-gradient-to-tr from-[#12132B] via-[#21182f] via-70% to-[#18067a] text-gray-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-sky-500 to-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>

      {/* Navbar */}
      <nav className="w-full z-50 px-6 sm:px-12 py-5 flex items-center justify-between bg-transparent backdrop-blur-md bg-white/5 border-b border-indigo-500/10 shadow-md fixed top-0">
        <Link to="/volunteer/dashboard" className="text-2xl font-extrabold bg-gradient-to-r from-pink-400 via-indigo-400 to-green-400 bg-clip-text text-transparent">
          VolunteerHub
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link to="/volunteer/dashboard" className="hover:text-pink-400 transition">Dashboard</Link>
          <Link to="/allbookings" className="hover:text-green-400 transition">Bookings</Link>
          <Link to="/myprofile" className="hover:text-indigo-400 transition">Profile</Link>
          <Link to="/notifications" className="relative group ml-4">
            <Bell className="w-6 h-6 text-indigo-300 hover:text-white transition duration-150" />
            <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow">!</span>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Link to="/notifications" className="relative group">
            <Bell className="w-6 h-6 text-indigo-300 hover:text-white transition duration-150" />
            <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow">!</span>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 right-6 bg-[#1f2235] border border-indigo-500/20 rounded-lg px-6 py-4 shadow-xl z-50 flex flex-col gap-4 md:hidden">
            <Link to="/volunteer/dashboard" className="hover:text-pink-400 transition" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link to="/allbookings" className="hover:text-green-400 transition" onClick={() => setIsMenuOpen(false)}>Bookings</Link>
            <Link to="/myprofile" className="hover:text-indigo-400 transition" onClick={() => setIsMenuOpen(false)}>Profile</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 py-44 gap-20 flex-grow w-full relative z-10">
        <div className="text-center md:text-left max-w-xl space-y-9 flex-1">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-tr from-indigo-400 via-pink-500 to-green-400 text-transparent bg-clip-text drop-shadow-2xl tracking-tight leading-[1.1]">
            Welcome to VolunteerHub
          </h1>
          <p className="text-2xl md:text-xl text-gray-300/90 leading-relaxed font-medium drop-shadow">
            Empower your volunteer journey. Discover opportunities, track your impact, and connect with communities that care.
          </p>
          <div className="flex justify-center md:justify-start gap-8 pt-2">
            <Link to="/volunteerhub" className="px-9 py-3.5 bg-gradient-to-br from-indigo-600 via-fuchsia-700 to-pink-500 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition transform">Get Started</Link>
            <Link to="/myprofile" className="px-8 py-3 border-2 border-indigo-400 rounded-full font-bold text-lg text-indigo-100 bg-white/5 hover:bg-indigo-600 hover:text-white shadow-md transition">My Profile</Link>
          </div>
        </div>

        {/* Fixed Alignment Spline Container */}
        <div className="flex-1 h-[500px] md:h-[600px]">
          <Spline 
            scene="https://prod.spline.design/HsBTXpxLGtNrZAHv/scene.splinecode" 
            className="w-full h-full" 
          />
        </div>
      </section>

 {/* Stats Section */}
<section className="bg-[#1a1c2b] py-16 px-6 text-center">
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

    {/* Total Volunteers */}
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-700 to-pink-500 shadow-xl">
      <User size={32} className="mx-auto mb-2" />
      <p className="text-3xl font-bold">{volunteers.length}</p>
      <p className="text-gray-200">Total Volunteers</p>
    </div>

    {/* Unique Locations */}
    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-600 to-indigo-500 shadow-xl">
      <CalendarDays size={32} className="mx-auto mb-2" />
      <p className="text-3xl font-bold">
        {[...new Set(volunteers.map(v => v.location.toLowerCase()))].length}
      </p>
      <p className="text-gray-200">Locations Covered</p>
    </div>

    {/* Organizations */}
    <div className="p-6 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 shadow-xl">
      <ThumbsUp size={32} className="mx-auto mb-2" />
      <p className="text-3xl font-bold">
        {[...new Set(volunteers.map(v => v.organisation.toLowerCase()))].length}
      </p>
      <p className="text-gray-200">Partner Organizations</p>
    </div>

    {/* Volunteers with Badges */}
    <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500 to-green-400 shadow-xl">
      <User size={32} className="mx-auto mb-2" />
      <p className="text-3xl font-bold">
        {volunteers.filter(v => v.badge !== "None").length}
      </p>
      <p className="text-gray-200">Badged Volunteers</p>
    </div>
    
  </div>
</section>




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



      






      <section className="bg-[#0f172a] text-white py-16 px-6">
  <div className="max-w-5xl mx-auto text-center">
    <h2 className="text-4xl font-bold mb-6 text-teal-400">What Volunteers Can Do for Free</h2>
    <p className="text-lg leading-relaxed text-gray-300">
      Volunteering is not just about giving time—it's about creating impact. As a volunteer, there are countless ways to make a difference in your community without spending a single rupee. Your dedication, skills, and willingness to help are the most valuable assets you can offer.
      <br /><br />
      Whether you're passionate about education, the environment, animal welfare, or social justice, there’s always something you can contribute. You can tutor underprivileged students online, help local NGOs with their digital presence, organize cleanliness drives in your neighborhood, or even offer emotional support to people through helplines and community groups.
      <br /><br />
      Many organizations also need volunteers for tasks like data entry, content writing, graphic designing, or simply spreading awareness on social media. You don’t need professional experience—just the heart to help and the commitment to show up.
      <br /><br />
      The best part? Volunteering for free gives you the chance to learn new skills, meet like-minded people, and build a profile that stands out—professionally and personally. Every small act, when done together, leads to a massive ripple of change.
    </p>
  </div>
</section>






<section className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-16 px-6 shadow-inner">
  <div className="max-w-5xl mx-auto text-center border border-gray-700 rounded-xl p-10 bg-gray-950 bg-opacity-80 backdrop-blur-sm">
    <h2 className="text-4xl font-bold mb-6 text-indigo-400">Meet Your Amazing Volunteers</h2>
    <p className="text-lg text-gray-300 mb-8">
      Behind every impactful initiative is a team of selfless, passionate volunteers. Discover who they are, what they do,
      and how they are helping build a better tomorrow. Their commitment fuels the heart of your mission.
    </p>
    <a
      href="/volunteers"
      className="inline-block px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition duration-300 shadow-lg"
    >
      See All Volunteers
    </a>
  </div>
</section>


<section className="relative py-28 overflow-hidden">
  {/* Gradient angled background */}
  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 transform skew-y-3 origin-top"></div>

  <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-14">
    
    {/* LEFT: Text Content */}
    <div className="flex-1 text-center lg:text-left text-white">
      <h2 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
        Join the Conversation, <br /> Change the World 🌍
      </h2>
      <p className="text-lg text-orange-100 mb-8 max-w-xl">
        Be part of a vibrant zero-waste community — read stories, share your tips, 
        and get inspired by people making real change.
      </p>
      <button
        onClick={handleExploreCommunity}
        className="group relative px-8 py-4 bg-white text-orange-700 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        Explore Blogs
      </button>
    </div>

    {/* RIGHT: Illustration with floating icons */}
    <div className="flex-1 relative flex justify-center">
      {/* Glassmorphism circle */}
      <div className="w-72 h-72 lg:w-96 lg:h-96 bg-white/10 rounded-full backdrop-blur-lg border border-white/30 shadow-2xl flex items-center justify-center relative overflow-visible">
        
        {/* Main Illustration */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/3176/3176364.png"
          alt="Community"
          className="w-36 lg:w-48 animate-float"
        />

        {/* Floating icons */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
          className="w-10 absolute -top-6 left-12 animate-bounce-slow"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
          className="w-10 absolute bottom-4 -left-6 animate-bounce-slow delay-200"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
          className="w-10 absolute top-8 -right-6 animate-bounce-slow delay-500"
        />
      </div>
    </div>
  </div>

  {/* Floating animations */}
  <style>
    {`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .animate-bounce-slow {
        animation: bounce-slow 5s ease-in-out infinite;
      }
    `}
  </style>
</section>








      {/* Footer */}
      <footer className="text-center py-10 border-t border-indigo-500/40 text-gray-400 text-md font-medium tracking-wide bg-gray-900/70 shadow-inner backdrop-blur-2xl rounded-b-3xl">
        © 2025 <span className="font-bold text-indigo-300">VolunteerHub</span>. Crafted with care and purpose.
      </footer>
    </div>
  );
};

export default Volunteerdashboard;
