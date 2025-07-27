import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { haversineDistance, getCoordinates } from '../util/utils';

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
        setLoading(false);
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
      try {
        const userCoords = await getCoordinates(user.location);
        if (!userCoords) return toast.error("Can't get your coordinates.");

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
      }
    };

    findTopVendors();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white px-6 py-10">
      <Toaster />
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 text-green-400">🔍 Nearest Vendor Finder</h2>
        <p className="text-gray-400 mb-8">
          Based on your current location, here are the top 5 nearest vendors.
        </p>

        <button
          onClick={() => navigate('/ngo/dashboard')}
          className="mb-10 inline-block bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full transition-all duration-200"
        >
          ⬅ Back to Dashboard
        </button>

        {loading ? (
          <p className="text-lg animate-pulse text-gray-300">Loading...</p>
        ) : nearestVendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {nearestVendors.map((vendor, index) => (
              <div
                key={index}
                className="h-[250px] w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg transition hover:scale-105 hover:shadow-green-500/20 flex flex-col justify-center"
              >
                <h3 className="text-xl font-bold text-green-300 mb-3">
                  #{index + 1} — {vendor.name}
                </h3>
                <p className="text-gray-300 mb-2">
                  📍 <span className="text-white">{vendor.location}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  🛣️ Distance:{" "}
                  <span className="text-green-400 font-medium">
                    {vendor.distance.toFixed(2)} km
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-400 text-lg">No nearby vendors found.</p>
        )}
      </div>
    </div>
  );
};

export default Neartongo;
