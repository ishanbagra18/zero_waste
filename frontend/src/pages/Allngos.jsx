import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Search, MapPin, Mail, Phone, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        const allFetchedNgos = response.data.ngos || [];
        setNgos(allFetchedNgos);
        
        setFilteredNgos(allFetchedNgos.slice(0, 10));
      } catch (error) {
        console.error('Error fetching NGOs:', error);
      }
    };

    fetchAllNgos();
  }, [token]);

  useEffect(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();

    if (lowerQuery === '') {
      setFilteredNgos(ngos.slice(0, 10));
    } else {
      const filtered = ngos.filter(
        (ngo) =>
          ngo.name?.toLowerCase().includes(lowerQuery) ||
          ngo.organisation?.toLowerCase().includes(lowerQuery)
      );
      setFilteredNgos(filtered);
    }
  }, [searchQuery, ngos]);

  const handleChatClick = (ngoId) => {
    navigate(`/chatting/${ngoId}`);
  };

  const handleReviewClick = (ngoId) => {
    navigate(`/review/${ngoId}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16 selection:bg-cyan-500 selection:text-black">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-200 bg-clip-text text-transparent mb-4">
          Explore Certified NGOs
        </h2>
        <p className="text-zinc-400 text-base max-w-md mx-auto">
          {searchQuery === '' 
            ? "Showing top featured NGOs. Use search to discover more." 
            : `Found ${filteredNgos.length} matching NGOs.`
          }
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-14 max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search by name or organisation across all NGOs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner text-sm"
        />
      </div>

      {/* NGO Cards Grid */}
      {filteredNgos.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl max-w-md mx-auto">
          <p className="text-zinc-500 font-medium">No NGOs match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {filteredNgos.map((ngo, index) => (
            <motion.div
              key={ngo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-6 backdrop-blur-md hover:border-zinc-700/80 transition-all duration-300 shadow-xl"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  {ngo.role || 'NGO'}
                </span>
              </div>

              {/* Profile Head */}
              <div className="flex flex-col items-center mt-2">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur group-hover:bg-cyan-500/20 transition-all duration-300" />
                  <img
                    src={
                      ngo.photo?.url ||
                      'https://placehold.co/150x150/222/fff?text=NGO'
                    }
                    alt={ngo.name}
                    className="relative w-20 h-20 rounded-full object-cover border border-zinc-700/60 p-0.5 bg-zinc-900"
                  />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 tracking-tight text-center group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {ngo.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mt-1 mb-4 text-center">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="line-clamp-1">{ngo.organisation || 'Independent NGO'}</span>
                </div>
              </div>

              {/* Meta Details */}
              <div className="text-xs text-zinc-400 space-y-2.5 border-t border-zinc-800/60 pt-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate">{ngo.location || 'Remote / Unspecified'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate" title={ngo.email}>{ngo.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate">{ngo.phone || 'No phone provided'}</span>
                </div>
              </div>

              {/* Action Buttons Container */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => handleChatClick(ngo._id)}
                  className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 border border-zinc-700/50"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
                  Chat
                </button>

                <button
                  onClick={() => handleReviewClick(ngo._id)}
                  className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-200 shadow-md shadow-cyan-500/10"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
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