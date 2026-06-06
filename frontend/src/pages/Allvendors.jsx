import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Search, MapPin, Mail, Phone, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        const allFetchedVendors = response.data.vendors || [];
        setVendors(allFetchedVendors);
        
        // शुरुआत में सिर्फ पहले 10 Vendors दिखाई देंगे
        setFilteredVendors(allFetchedVendors.slice(0, 10));
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    fetchAllVendors();
  }, [token]);

  useEffect(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();

    if (lowerQuery === '') {
      // अगर सर्च बॉक्स खाली है, तो सिर्फ पहले 10vendors दिखाओ
      setFilteredVendors(vendors.slice(0, 10));
    } else {
      // अगर यूजर कुछ टाइप कर रहा है, तो पूरे डेटाबेस (vendors) में से खोजो
      const filtered = vendors.filter(
        (vendor) =>
          vendor.name?.toLowerCase().includes(lowerQuery) ||
          vendor.organisation?.toLowerCase().includes(lowerQuery)
      );
      setFilteredVendors(filtered);
    }
  }, [searchQuery, vendors]);

  const handleChatClick = (vendorId) => {
    navigate(`/chatting/${vendorId}`);
  };

  const handleReviewClick = (vendorId) => {
    navigate(`/review/${vendorId}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16 selection:bg-amber-500 selection:text-black">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent mb-4">
          Explore Certified Vendors
        </h2>
        <p className="text-zinc-400 text-base max-w-md mx-auto">
          {searchQuery === '' 
            ? "Showing top featured vendors. Use search to discover more." 
            : `Found ${filteredVendors.length} matching vendors.`
          }
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-14 max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-amber-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search by name or organisation across all vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all shadow-inner text-sm"
        />
      </div>

      {/* Vendor Cards Grid */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl max-w-md mx-auto">
          <p className="text-zinc-500 font-medium">No vendors match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-6 backdrop-blur-md hover:border-zinc-700/80 transition-all duration-300 shadow-xl"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  {vendor.role || 'Vendor'}
                </span>
              </div>

              {/* Profile Head */}
              <div className="flex flex-col items-center mt-2">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-amber-500/10 rounded-full blur group-hover:bg-amber-500/20 transition-all duration-300" />
                  <img
                    src={
                      vendor.photo?.url ||
                      'http://pluspng.com/img-png/png-user-icon-circled-user-icon-2240.png'
                    }
                    alt={vendor.name}
                    className="relative w-20 h-20 rounded-full object-cover border border-zinc-700/60 p-0.5 bg-zinc-900"
                  />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 tracking-tight text-center group-hover:text-amber-400 transition-colors line-clamp-1">
                  {vendor.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mt-1 mb-4 text-center">
                  <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="line-clamp-1">{vendor.organisation || 'Independent'}</span>
                </div>
              </div>

              {/* Meta Details */}
              <div className="text-xs text-zinc-400 space-y-2.5 border-t border-zinc-800/60 pt-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate">{vendor.location || 'Remote / Unspecified'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate" title={vendor.email}>{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate">{vendor.phone || 'No phone provided'}</span>
                </div>
              </div>

              {/* Action Buttons Container */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => handleChatClick(vendor._id)}
                  className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 border border-zinc-700/50"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
                  Chat
                </button>

                <button
                  onClick={() => handleReviewClick(vendor._id)}
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-200 shadow-md shadow-amber-500/10"
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

export default Allvendors;