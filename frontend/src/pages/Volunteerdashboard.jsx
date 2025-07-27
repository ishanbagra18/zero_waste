import React from 'react';
import { Link } from 'react-router-dom';
// Replace below with your own image path or URL
const volunteerImg = 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=800&q=80';

const Volunteerdashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-28 gap-12 flex-grow">
        {/* Text Content */}
        <div className="text-center md:text-left max-w-xl space-y-6">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-500 to-green-400 text-transparent bg-clip-text drop-shadow-lg">
            Welcome to VolunteerHub
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Empower your volunteer journey. Discover opportunities, track your impact, and connect with communities that care.
          </p>

          <div className="flex justify-center md:justify-start gap-6">
            <a
              href="#features"
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

      {/* Features Section */}
      <section
        id="features"
        className="bg-gray-900 bg-opacity-90 py-20 px-6 max-w-6xl mx-auto rounded-xl shadow-lg mb-16"
      >
        <h2 className="text-4xl font-bold text-center mb-12">Why VolunteerHub?</h2>
        <div className="flex flex-col md:flex-row justify-center gap-12">
          <FeatureCard
            icon="🔍"
            title="Find Opportunities"
            description="Explore curated, local volunteering options tailored to your interests."
            accent="from-indigo-500 to-blue-500"
          />
          <FeatureCard
            icon="⏰"
            title="Track Your Hours"
            description="Keep a detailed log of your contributions and milestones."
            accent="from-pink-400 to-rose-600"
          />
          <FeatureCard
            icon="🤝"
            title="Build Connections"
            description="Join vibrant communities and collaborate on meaningful projects."
            accent="from-green-400 to-emerald-600"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-700 text-gray-500 text-sm backdrop-blur-sm bg-gray-900/60">
        © 2025 VolunteerHub. Crafted with care and purpose.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, accent }) => (
  <div
    className={`
      flex flex-col items-center text-center p-10 rounded-2xl shadow-2xl
      bg-gray-900 bg-opacity-80 border border-gray-700 max-w-xs mx-auto w-full
      backdrop-blur-xl hover:scale-105 transition-transform duration-300
      hover:shadow-[0_2px_32px_4px_rgba(99,102,241,0.3)]
    `}
  >
    <div className={`text-6xl mb-5 bg-gradient-to-r ${accent} text-transparent bg-clip-text`}>
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mb-3 text-gray-100 drop-shadow-md">{title}</h3>
    <p className="text-gray-300 font-light">{description}</p>
  </div>
);

export default Volunteerdashboard;
