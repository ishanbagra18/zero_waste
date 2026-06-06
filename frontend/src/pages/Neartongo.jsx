import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { haversineDistance, getCoordinates } from '../util/utils';
import { MdLocationOn, MdMap, MdArrowBack, MdBusiness } from 'react-icons/md';

const Neartongo = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [nearestVendors, setNearestVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Decode token
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.userId) setUserId(payload.userId);
    } catch {
      toast.error('Invalid token. Please log in again.');
      setLoading(false);
    }
  }, [token]);

  // Fetch user
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:3002/api/users/myprofile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch profile.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // Find top 5 vendors
  useEffect(() => {
    const findTopVendors = async () => {
      if (!user?.location || !token) return;
      setLoading(true);
      try {
        const userCoords = await getCoordinates(user.location);
        if (!userCoords) {
          setLoading(false);
          return toast.error("Can't get your coordinates.");
        }

        const res = await axios.get("http://localhost:3002/api/users/allvendor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const vendors = res.data.vendors;
        const vendorWithDistances = [];

        for (const vendor of vendors) {
          if (!vendor.location) continue;
          const vendorCoords = await getCoordinates(vendor.location);
          if (!vendorCoords) continue;

          const dist = haversineDistance(
            userCoords.lat,
            userCoords.lon,
            vendorCoords.lat,
            vendorCoords.lon
          );

          vendorWithDistances.push({ ...vendor, distance: dist });
        }

        const topFive = vendorWithDistances
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        setNearestVendors(topFive);
      } catch (error) {
        console.error("Error finding nearest vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    findTopVendors();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16 selection:bg-emerald-500 selection:text-black antialiased">
      <Toaster />

      <div className="max-w-5xl mx-auto">
        {/* Back Button Container */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/ngo/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all text-sm font-semibold shadow-sm"
          >
            <MdArrowBack size={18} />
            Back to Dashboard
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 bg-clip-text text-transparent mb-4">
            Nearest Vendor Finder
          </h2>
          <p className="text-zinc-400 text-base">
            Optimized logistical sorting based on your profile address. Discovered top 5 nearest supply centers.
          </p>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="text-zinc-400 text-sm font-medium tracking-wide">Calculating geographical matrix...</span>
          </div>
        ) : nearestVendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearestVendors.map((vendor, index) => (
              <div
                key={vendor._id || index}
                className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 backdrop-blur-md hover:border-zinc-700/80 transition-all duration-300 shadow-xl"
              >
                {/* Ranking Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] tracking-wider font-black text-emerald-400 uppercase">
                    Rank #{index + 1}
                  </span>
                </div>

                {/* Profile Meta Head */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                      <MdBusiness size={22} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-zinc-100 tracking-tight truncate" title={vendor.name}>
                        {vendor.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
                        {vendor.organisation || 'Independent Provider'}
                      </p>
                    </div>
                  </div>

                  {/* Distance Indicator Segment */}
                  <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                      <MdMap className="w-4 h-4" /> Distance Matrix:
                    </span>
                    <span className="text-sm font-black text-emerald-400 tracking-tight">
                      {vendor.distance.toFixed(2)} km
                    </span>
                  </div>
                </div>

                {/* Location Footer Section */}
                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-start gap-2 text-xs text-zinc-400">
                  <MdLocationOn className="text-zinc-600 shrink-0 w-4 h-4 mt-0.5" />
                  <p className="line-clamp-2 leading-relaxed" title={vendor.location}>
                    {vendor.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl max-w-md mx-auto">
            <p className="text-rose-400 font-medium">No nearby logistics vendors were resolved.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Neartongo;