import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
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

const Allvendors = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllVendors = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/users/allvendor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVendors(response.data.vendors || []);
        setFilteredVendors(response.data.vendors || []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    fetchAllVendors();
  }, [token]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name?.toLowerCase().includes(lowerQuery) ||
        vendor.organisation?.toLowerCase().includes(lowerQuery)
    );
    setFilteredVendors(filtered);
  }, [searchQuery, vendors]);

  const handleChatClick = (vendorId) => {
    navigate(`/chatting/${vendorId}`);
  };


  const handlereviewclick = (vendorId)=>
  {
    navigate(`/review/${vendorId}`);
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-amber-400 tracking-wider drop-shadow-lg">
        🏪 Explore All Vendors
      </h2>

      <div className="mb-10 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="🔍 Search by name or organisation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
        />
      </div>

      {filteredVendors.length === 0 ? (
        <p className="text-center text-gray-500 text-lg animate-pulse">No Vendors found.</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`relative rounded-2xl p-6 shadow-2xl border border-zinc-700 bg-gradient-to-br ${
                colorThemes[index % colorThemes.length]
              } transition-all duration-300`}
            >
              <div className="flex flex-col items-center">
                <img
                  src={
                    vendor.photo?.url ||
                    'http://pluspng.com/img-png/png-user-icon-circled-user-icon-2240.png'
                  }
                  alt={vendor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4 group-hover:rotate-3 transition duration-300"
                />
                <h3 className="text-2xl font-bold text-white text-center drop-shadow">
                  {vendor.name}
                </h3>
                <p className="text-sm italic text-gray-200 mb-2 text-center">
                  {vendor.organisation || 'Independent Vendor'}
                </p>
              </div>

              <div className="text-sm text-white mt-3 space-y-1 text-center">
                <p>
                  <span className="font-semibold">📍 Location:</span> {vendor.location || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">📧 Email:</span> {vendor.email}
                </p>
                <p>
                  <span className="font-semibold">📞 Phone:</span> {vendor.phone || 'N/A'}
                </p>
              </div>

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full bg-black/40 text-xs uppercase font-semibold border border-white shadow">
                  {vendor.role}
                </span>
              </div>

              <div className="mt-5 text-center flex gap-10">
                <button
                  onClick={() => handleChatClick(vendor._id)}
                  className="inline-flex items-center gap-2 bg-black/60 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md border border-white transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Now
                </button>


                 <button
                  onClick={() => handlereviewclick(vendor._id)}
                  className="inline-flex items-center gap-2 bg-black/60 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md border border-white transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  review
                </button>



              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allvendors;
