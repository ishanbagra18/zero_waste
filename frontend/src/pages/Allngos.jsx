// Allngos.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageCircle, Star } from 'lucide-react'; // ✅ 1. Import the Star icon
import { useNavigate } from 'react-router-dom';

const colorThemes = [
  'from-cyan-500 via-blue-600 to-indigo-700',
  'from-pink-500 via-red-500 to-yellow-500',
  'from-green-400 via-teal-500 to-cyan-600',
  'from-purple-500 via-fuchsia-500 to-pink-500',
  'from-orange-400 via-amber-500 to-yellow-600',
  'from-indigo-500 via-purple-600 to-pink-600',
  'from-teal-400 via-cyan-500 to-blue-600',
  'from-lime-400 via-green-500 to-emerald-600',
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-yellow-400 via-orange-500 to-red-600',
];

const Allngos = () => {
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllNgos = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/users/allngo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.ngos || [];
        setNgos(data);
        setFilteredNgos(data);
      } catch (error) {
        console.error('Error fetching NGOs:', error);
      }
    };

    fetchAllNgos();
  }, [token]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = ngos.filter(
      (ngo) =>
        ngo.name?.toLowerCase().includes(lowerQuery) ||
        ngo.organisation?.toLowerCase().includes(lowerQuery)
    );
    setFilteredNgos(filtered);
  }, [searchQuery, ngos]);

  const handleChatClick = (ngoId) => {
    navigate(`/chatting/${ngoId}`);
  };

  // ✅ 2. Add the handler function for the review button
  const handleReviewClick = (ngoId) => {
    navigate(`/review/${ngoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-cyan-400 tracking-wider drop-shadow-lg">
        🌐 Explore All NGOs
      </h2>

      <div className="mb-10 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="🔍 Search by name or organisation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
      </div>

      {filteredNgos.length === 0 ? (
        <p className="text-center text-gray-500 text-lg animate-pulse">No NGOs found.</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredNgos.map((ngo, index) => (
            <motion.div
              key={ngo._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`group relative rounded-2xl p-6 shadow-2xl border border-zinc-700 bg-gradient-to-br ${
                colorThemes[index % colorThemes.length]
              } transition-all duration-300 flex flex-col`}
            >
              <div className="flex-grow">
                <div className="flex flex-col items-center">
                  <img
                    src={
                      ngo.photo?.url ||
                      'https://placehold.co/150x150/222/fff?text=NGO'
                    }
                    alt={ngo.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4 group-hover:rotate-3 transition duration-300"
                  />
                  <h3 className="text-2xl font-bold text-white text-center drop-shadow">
                    {ngo.name}
                  </h3>
                  <p className="text-sm italic text-gray-200 mb-2 text-center">
                    {ngo.organisation || 'Independent NGO'}
                  </p>
                </div>

                <div className="text-sm text-white mt-3 space-y-1 text-center">
                  <p>
                    <span className="font-semibold">📍 Location:</span> {ngo.location || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">📧 Email:</span> {ngo.email}
                  </p>
                  <p>
                    <span className="font-semibold">📞 Phone:</span> {ngo.phone || 'N/A'}
                  </p>
                </div>
              </div>


              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full bg-black/40 text-xs uppercase font-semibold border border-white shadow">
                  {ngo.role}
                </span>
              </div>

              {/* ✅ 3. Add the button container with both buttons */}
              <div className="mt-5 pt-4 border-t border-white/20 flex justify-center items-center gap-4">
                <button
                  onClick={() => handleChatClick(ngo._id)}
                  className="inline-flex items-center gap-2 bg-black/60 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md border border-white transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </button>
                <button
                  onClick={() => handleReviewClick(ngo._id)}
                  className="inline-flex items-center gap-2 bg-amber-500/80 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md border border-white transition-all duration-300 hover:scale-105"
                >
                  <Star className="w-4 h-4" />
                  Review
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allngos;
